import parser from './autoSql'
import types from './defaultTypes'
import { detectTypes } from './util'

export default class BED {
  constructor(args = {}) {
    if (args.autoSql) {
      this.autoSql = detectTypes(parser.parse(args.autoSql))
    } else if (args.type && types[args.type]) {
      this.autoSql = detectTypes(
        types[args.type] || throw new Error('Type not found'),
      )
    } else {
      this.autoSql = detectTypes(types.defaultBedSchema)
    }
  }

  static unescape(s = '') {
    return s.replace(/%([0-9A-Fa-f]{2})/g, (match, seq) =>
      String.fromCharCode(parseInt(seq, 16)),
    )
  }

  /*
   * parses a line of text as a BED line with the loaded autoSql schema
   *
   * @param line - a BED line
   * @param opts - supply opts.uniqueId have a uniqueId not encoded in BED file itself
   * @return a object representing a feature
   */
  parseLine(line, opts = {}) {
    const { autoSql } = this
    if (line.startsWith('track') || line.startsWith('browser'))
      throw new Error(
        `Error: track and browser line parsing is not supported, please filter:\n${line}`,
      )

    if (!autoSql)
      throw new Error(
        'no autoSql configured, please supply autoSql or format to BED constructor',
      )

    const { uniqueId } = opts // optionally supply a uniqueId based on fileoffset
    const fields = line.split('\t')
    const featureData = {}
    if (uniqueId) featureData.uniqueId = uniqueId

    for (let i = 0; i < autoSql.fields.length; i += 1) {
      const autoField = autoSql.fields[i]
      let columnVal = fields[i]
      const { isNumeric, isArray, arrayIsNumeric, name } = autoField
      if (columnVal === null || columnVal === undefined) {
        break
      }
      console.log(autoField)

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

    if (featureData.chrom) {
      featureData.chrom = BED.unescape(featureData.chrom)
    }

    if (featureData.strand) {
      featureData.strand = { '-': -1, '+': 1 }[featureData.strand] || 0
    }

    if (opts.regularize) {
      return this.regularizeFeat(featureData)
    }
    return featureData
  }

  regularizeFeat(featureData) {
    const {
      chrom: refName,
      chromStart: start,
      chromEnd: end,
      ...rest
    } = featureData
    return { ...rest, refName, start, end }
  }
}
