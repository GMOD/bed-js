import snakeCase from 'snake-case'
import parser from './autoSql'
import types from './defaultTypes'

/* eslint no-param-reassign: ["error", { "props": false }] */
const detectTypes = autoSql => {
  const numericTypes = ['uint', 'int', 'float', 'long']
  const fields = autoSql.fields.map(autoField => {
    const type = {}
    if (!autoField.size && numericTypes.includes(autoField.type)) {
      type.isNumeric = true
    }
    if (autoField.size) {
      type.isArray = true
    }
    if (autoField.size && numericTypes.includes(autoField.type)) {
      type.arrayIsNumeric = true
    }
    return { ...autoField, ...type }
  })
  return { ...autoSql, fields }
}
export default class BED {
  constructor(args = {}) {
    if (args.autoSql) {
      this.autoSql = detectTypes(parser.parse(args.autoSql))
    } else if (args.type && types[args.type]) {
      this.autoSql = detectTypes(
        types[args.type] || throw new Error('Type not found'),
      )
    }
  }

  parseLine(line) {
    const { autoSql } = this
    if (line.startsWith('track') || line.startsWith('browser'))
      throw new Error(
        `Error: track and browser line parsing is not supported, please filter:\n${line}`,
      )

    const ret = line.split('\t')
    if (ret.length < 3)
      throw new Error(
        'Error: line not tab delimited? (note: specification for BED allows spaces but this is unimplemented)',
      )
    if (autoSql) {
      const [refName, start, end, ...rest] = ret
      return this.parseBedText(refName, +start, +end, rest, {
        offset: 3,
      })
    }
    return BED.parseBedDefault(ret)
  }

  static unescape(s) {
    return s.replace(/%([0-9A-Fa-f]{2})/g, (match, seq) =>
      String.fromCharCode(parseInt(seq, 16)),
    )
  }

  static featureNames = 'refName start end name score strand thickStart thickEnd itemRgb blockCount blockSizes blockStarts'.split(
    ' ',
  )

  static parseBedDefault(ret) {
    const f = ret.map(a => (a === '.' ? null : a))

    const parsed = {}
    for (let i = 0; i < BED.featureNames.length; i += 1) {
      if (f[i] !== null && f[i] !== undefined) {
        parsed[BED.featureNames[i]] = f[i]
      }
    }
    if (parsed.start !== null) parsed.start = parseInt(parsed.start, 10)
    if (parsed.end !== null) parsed.end = parseInt(parsed.end, 10)
    if (parsed.score != null) parsed.score = parseFloat(parsed.score, 10)

    // unescape only the ref columns
    parsed.refName = BED.unescape(parsed.refName)
    parsed.strand = { '+': 1, '-': -1 }[parsed.strand] || 0

    return parsed
  }

  /*
   * refName - string: name of chromosome or refseq
   * start - number: start 0 based half open coordinate
   * end - number: end 0 based half open coordinate
   * rest - a list of fields to parse
   * opts.offset to skip fields from the autoSql that have already been parsed
   * opts.uniqueId to supply a uniqueId that was not encoded in the BED file itself
   */
  parseBedText(refName, start, end, rest, opts = {}) {
    const { autoSql } = this
    const { offset, uniqueId } = opts
    if (!autoSql)
      throw new Error(
        'no autoSql configured, please supply autoSql or format to BED constructor',
      )
    const featureData = { refName, start, end }
    if (uniqueId) featureData.uniqueId = uniqueId
    const bedColumns = Array.isArray(rest) ? rest : rest.split('\t')
    // first three columns (chrom,start,end) are not included in bigBed, so use offset to compensate
    for (let i = offset; i < autoSql.fields.length; i += 1) {
      const autoField = autoSql.fields[i]
      let columnVal = bedColumns[i - offset]
      const { isNumeric, isArray, arrayIsNumeric, name } = autoField
      if (columnVal === null || columnVal === undefined) {
        console.warn(`column ${i} does not exist, expected ${name}`)
        break
      }

      if (columnVal !== '.') {
        if (isNumeric) {
          const num = Number(columnVal)
          // if the number parse results in NaN, somebody probably
          // listed the type erroneously as numeric, so don't use
          // the parsed number
          columnVal = Number.isNaN(num) ? columnVal : num
        } else if (isArray) {
          // parse array values
          columnVal = columnVal.split(',')
          if (columnVal[columnVal.length - 1] === '') columnVal.pop()
          if (arrayIsNumeric) columnVal = columnVal.map(str => Number(str))
        }

        featureData[snakeCase(name)] = columnVal
      }
    }

    featureData.strand = { '-': -1, '+': 1 }[featureData.strand] || 0
    return featureData
  }
}
