export interface AutoSqlField {
  // fixed-size arrays carry a numeric size (char[2]); variable-length arrays
  // carry the name of the count field (int[blockCount])
  size?: number | string
  type: string
  name: string
  comment: string
  vals?: string[]
}

export interface AutoSqlDeclaration {
  type: string
  name: string
  comment: string
  fields: AutoSqlField[]
}

const FIELD_TYPES = [
  'int',
  'uint',
  'short',
  'ushort',
  'byte',
  'ubyte',
  'float',
  'char',
  'string',
  'lstring',
  'enum',
  'double',
  'bigint',
  'set',
]

const DECLARE_TYPES = ['simple', 'object', 'table']

// unlike the type keywords, these are lowercase-only in autoSql
const INDEX_TYPES = ['primary', 'index', 'unique']

const whitespace = /[ \t\n\r]*/y
const nameChars = /[A-Za-z_][A-Za-z0-9_]*/y
const digits = /[0-9]+/y
const valueChars = /[^,)\s]+/y
const identifierChar = /[A-Za-z0-9_]/

export function parse(input: string): AutoSqlDeclaration {
  let pos = 0

  function fail(expected: string): never {
    const upTo = input.slice(0, pos)
    const line = upTo.split('\n').length
    const column = pos - upTo.lastIndexOf('\n')
    throw new Error(
      `autoSql parse error at line ${String(line)} column ${String(column)}: expected ${expected}`,
    )
  }

  function match(regex: RegExp) {
    regex.lastIndex = pos
    const result = regex.exec(input)
    if (result) {
      pos = regex.lastIndex
    }
    return result?.[0]
  }

  function skipWhitespace() {
    match(whitespace)
  }

  function literal(text: string) {
    if (input.startsWith(text, pos)) {
      pos += text.length
      return true
    }
    return false
  }

  function keyword(words: string[], caseInsensitive: boolean) {
    for (const word of words) {
      const candidate = input.slice(pos, pos + word.length)
      if (
        (caseInsensitive ? candidate.toLowerCase() : candidate) === word &&
        !identifierChar.test(input[pos + word.length] ?? '')
      ) {
        pos += word.length
        return word
      }
    }
    return undefined
  }

  function quoted() {
    const quote = input[pos]
    if (quote !== '"' && quote !== "'") {
      return undefined
    }
    const end = input.indexOf(quote, pos + 1)
    if (end === -1) {
      return undefined
    }
    const text = input.slice(pos + 1, end)
    pos = end + 1
    return text
  }

  function readName() {
    return match(nameChars) ?? fail('a name')
  }

  // ENCODE schemas quote a field name that would otherwise be a SQL reserved
  // word, as in `string "name" unique;`
  function readFieldName() {
    return quoted() ?? readName()
  }

  // a comment runs to the end of its line: the text between its first and last
  // quote, or, for the unclosed quotes seen in real UCSC files, whatever is
  // there with a lone leading/trailing quote stripped. A field list closing on
  // the same line as the last comment ends the comment at its closing quote
  // instead, so the ')' is left to parse.
  function readComment() {
    let end = pos
    while (end < input.length && input[end] !== '\n' && input[end] !== '\r') {
      end++
    }
    const raw = input.slice(pos, end)
    const text = raw.trim()
    const closed = /^"(.*)".*$/.exec(text)
    const lastQuote = raw.lastIndexOf('"')
    pos =
      closed && raw.slice(lastQuote + 1).includes(')')
        ? pos + lastQuote + 1
        : end
    return closed ? closed[1]! : text.replace(/^"|"$/g, '')
  }

  function skipLineComments() {
    skipWhitespace()
    while (literal('#')) {
      readComment()
      skipWhitespace()
    }
  }

  function readFieldType() {
    const type = keyword(FIELD_TYPES, true)
    if (type) {
      return type
    }
    const declared = keyword(DECLARE_TYPES, true)
    if (declared) {
      skipWhitespace()
      return `${declared} ${readName()}`
    }
    return undefined
  }

  // an array size is either a count (char[2]) or the name of a count field
  // (int[blockCount]), and may follow either the type or the field name
  function readSize() {
    skipWhitespace()
    const count = match(digits)
    const size = count === undefined ? readName() : Number.parseInt(count)
    skipWhitespace()
    if (!literal(']')) {
      fail("']'")
    }
    return size
  }

  // enum/set values are names in most schemas, but real ones also hold quoted
  // strings (enum("ucsc","ncbi")) and bare numbers (enum(1,2,3))
  function readValues() {
    const values = []
    for (;;) {
      skipWhitespace()
      values.push(quoted() ?? match(valueChars) ?? fail('an enum value'))
      skipWhitespace()
      if (!literal(',')) {
        if (!literal(')')) {
          fail("',' or ')'")
        }
        return values
      }
    }
  }

  // primary/index/unique (each optionally sized) and auto, in any order
  function skipFieldModifiers() {
    for (;;) {
      const start = pos
      skipWhitespace()
      if (keyword(INDEX_TYPES, false)) {
        const afterIndexType = pos
        skipWhitespace()
        if (literal('[')) {
          readSize()
        } else {
          pos = afterIndexType
        }
      } else if (!keyword(['auto'], false)) {
        pos = start
        return
      }
    }
  }

  function readFieldEnd() {
    skipFieldModifiers()
    skipWhitespace()
    if (!literal(';')) {
      fail("';'")
    }
    skipWhitespace()
    return readComment()
  }

  function readField() {
    if (literal('#')) {
      readComment()
      return undefined
    }
    const type = readFieldType() ?? fail('a field type')
    skipWhitespace()
    if (literal('[')) {
      const size = readSize()
      skipWhitespace()
      return { type, size, name: readFieldName(), comment: readFieldEnd() }
    }
    if (literal('(')) {
      const vals = readValues()
      skipWhitespace()
      return { type, vals, name: readFieldName(), comment: readFieldEnd() }
    }
    const name = readFieldName()
    const afterName = pos
    skipWhitespace()
    if (literal('[')) {
      return { type, size: readSize(), name, comment: readFieldEnd() }
    }
    pos = afterName
    return { type, name, comment: readFieldEnd() }
  }

  function readFieldList() {
    const fields: AutoSqlField[] = []
    skipWhitespace()
    const first = readField()
    if (first) {
      fields.push(first)
    }
    for (;;) {
      skipWhitespace()
      if (pos >= input.length || input[pos] === ')') {
        return fields
      }
      const field = readField()
      if (field) {
        fields.push(field)
      }
    }
  }

  skipLineComments()
  const type = keyword(DECLARE_TYPES, true) ?? fail('simple, object or table')
  skipWhitespace()
  const name = readName()
  skipWhitespace()
  const comment = readComment()
  skipLineComments()
  if (!literal('(')) {
    fail("'('")
  }
  const fields = readFieldList()
  skipWhitespace()
  if (!literal(')')) {
    fail("')'")
  }
  skipWhitespace()
  if (pos !== input.length) {
    fail('end of input')
  }
  return { type, name, comment, fields }
}
