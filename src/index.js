import parser from './autoSql'
import types from './defaultTypes'
import { detectTypes } from './util'

export default class BED {
  constructor(args = {}) {
    if (args.autoSql) {
      this.autoSql = detectTypes(parser.parse(args.autoSql))
    } else if (args.type) {
      if (!types[args.type]) {
        throw new Error('Type not found')
      }
      this.autoSql = detectTypes(types[args.type])
    } else {
      this.autoSql = detectTypes(types.defaultBedSchema)
    }
  }

  /*
   * parses a line of text as a BED line with the loaded autoSql schema
   *
   * @param line - a BED line as tab delimited text or array
   * @param opts - supply opts.uniqueId
   * @return a object representing a feature
   */
  parseLine(line, opts = {}) {
    const { autoSql } = this
    const { uniqueId } = opts
    let fields = line
    if (!Array.isArray(line)) {
      if (line.startsWith('track') || line.startsWith('browser')) {
        throw new Error(
          `track and browser line parsing is not supported, please filter:\n${line}`,
        )
      }
      fields = line.split('\t')
    }

    const featureData = {}
    if (uniqueId) {
      featureData.uniqueId = uniqueId
    }

    for (let i = 0; i < autoSql.fields.length; i += 1) {
      const autoField = autoSql.fields[i]
      let columnVal = fields[i]
      const { isNumeric, isArray, arrayIsNumeric, name } = autoField
      if (columnVal === null || columnVal === undefined) {
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
          if (arrayIsNumeric) columnVal = columnVal.map((str) => Number(str))
        }

        featureData[name] = columnVal
      }
    }

    if (featureData.chrom) {
      featureData.chrom = decodeURIComponent(featureData.chrom)
    }
    featureData.strand = { '.': 0, '-': -1, '+': 1 }[featureData.strand] || 0

    return featureData
  }
}
