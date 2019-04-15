import parser from './autoSql'
import types from './defaultTypes'

// adds annotation to autoSql fields
// for numeric fields "isNumeric" is added
// for array types "isArray" is added
// for numeric array types "isArray" and "arrayIsNumeric" is set
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

  parseLine(line, opts = {}) {
    const { autoSql } = this
    if (line.startsWith('track') || line.startsWith('browser'))
      throw new Error(
        `Error: track and browser line parsing is not supported, please filter:\n${line}`,
      )
    return autoSql
      ? this.parseLineAutoSql(line, opts)
      : BED.parseLineDefault(line, opts)
  }

  static unescape(s = '') {
    return s.replace(/%([0-9A-Fa-f]{2})/g, (match, seq) =>
      String.fromCharCode(parseInt(seq, 16)),
    )
  }

  // default BED12 fields, parses as many as possible of these in parseLineDefault
  static featureNames = 'chrom chromStart chromEnd name score strand thickStart thickEnd itemRgb blockCount blockSizes blockStarts'.split(
    ' ',
  )

  /*
   * parses a line of text as a BED line with the default schema, can contain a subset of the BED12 fields
   *
   * @param line - a BED line
   * @param opts - supply opts.uniqueId have a uniqueId not encoded in BED file itself
   * @return a object representing a feature
   */
  static parseLineDefault(line, opts = {}) {
    const fields = line.split('\t')
    const f = fields.map(a => (a === '.' ? null : a))

    const featureData = {}
    for (let i = 0; i < BED.featureNames.length; i += 1) {
      if (f[i] !== null && f[i] !== undefined) {
        featureData[BED.featureNames[i]] = f[i]
      }
    }
    if (featureData.chromStart !== null)
      featureData.chromStart = parseInt(featureData.chromStart, 10)
    if (featureData.chromEnd !== null)
      featureData.chromEnd = parseInt(featureData.chromEnd, 10)
    if (featureData.score != null)
      featureData.score = parseFloat(featureData.score, 10)

    // unescape only the ref columns
    featureData.chrom = BED.unescape(featureData.chrom)
    featureData.strand = { '+': 1, '-': -1 }[featureData.strand] || 0
    if (opts.uniqueId) featureData.uniqueId = opts.uniqueId

    return featureData
  }

  /*
   * parses a line of text as a BED line with the loaded autoSql schema
   *
   * @param line - a BED line
   * @param opts - supply opts.uniqueId have a uniqueId not encoded in BED file itself
   * @return a object representing a feature
   */
  parseLineAutoSql(line, opts = {}) {
    const { autoSql } = this
    const { uniqueId } = opts // optionally supply a uniqueId based on fileoffset
    if (!autoSql)
      throw new Error(
        'no autoSql configured, please supply autoSql or format to BED constructor',
      )
    const fields = line.split('\t')
    const featureData = {}
    if (uniqueId) featureData.uniqueId = uniqueId

    for (let i = 0; i < autoSql.fields.length; i += 1) {
      const autoField = autoSql.fields[i]
      let columnVal = fields[i]
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

        featureData[name] = columnVal
      }
    }

    featureData.strand = { '-': -1, '+': 1 }[featureData.strand] || 0
    return featureData
  }
}
