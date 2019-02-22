import snakeCase from 'snake-case'
import parser from './autoSql'
import types from './defaultTypes'

const bedFeatureNames = 'refID start end name score strand'.split(' ')

/**
 * Class representing a BED parser
 * @param {object} args
 */
class BED {
  constructor(args = {}) {
    if (args.autoSql) {
      this.format = parser(args.autoSql)
    } else if (args.type && types[args.type]) {
      this.format = types[args.type]
    } else if (args.type) {
      console.error('Type not found')
    } else {
      this.format = types.BED6
    }
  }

  parseLine(line) {
    if (this.format) {
      const [refID, start, end, ...rest] = line.split('\t')
      return this.parseBedText(refID, +start, +end, rest, this.format, 3)
    }
    return this.parseBedDefault(line)
  }

  static unescape(s) {
    return s.replace(/%([0-9A-Fa-f]{2})/g, (match, seq) =>
      String.fromCharCode(parseInt(seq, 16)),
    )
  }

  parseBedDefault(line) {
    const f = line.split('\t').map(a => (a === '.' ? null : a))

    // unescape only the ref columns

    const parsed = {}
    for (let i = 0; i < bedFeatureNames.length; i += 1) {
      if (f[i] !== null && f[i] !== undefined) {
        parsed[bedFeatureNames[i]] = f[i]
      }
    }
    if (parsed.start !== null) parsed.start = parseInt(parsed.start, 10)
    if (parsed.end !== null) parsed.end = parseInt(parsed.end, 10)
    if (parsed.score != null) parsed.score = parseFloat(parsed.score, 10)
    parsed.refID = this.unescape(parsed.refID)

    parsed.strand = { '+': 1, '-': -1 }[parsed.strand] || 0

    return parsed
  }

  static parseBedText(refID, start, end, rest, asql, offset = 0) {
    // include ucsc-style names as well as jbrowse-style names
    const featureData = {
      refID,
      start,
      end,
    }

    const bedColumns = Array.isArray(rest) ? rest : rest.split('\t')
    const numericTypes = ['uint', 'int', 'float', 'long']

    // first three columns (chrom,start,end) are not included in bigBed, so use offset to compensate
    for (let i = offset; i < asql.fields.length; i += 1) {
      if (bedColumns[i - offset] !== null && bedColumns[i - offset] !== '.') {
        const autoField = asql.fields[i]
        let columnVal = bedColumns[i - offset]
        if (columnVal === null || columnVal === undefined) {
          // console.warn(`column ${i-offset} does not exist for line but expected it to be ${asql.fields[i].name}`, bedColumns)
          break
        }

        // for speed, cache some of the tests we need inside the autofield definition
        if (!autoField.requestWorkerCache) {
          autoField.requestWorkerCache = {
            isNumeric: !autoField.size && numericTypes.includes(autoField.type),
            isArray: autoField.size,
            arrayIsNumeric:
              autoField.size && numericTypes.includes(autoField.type),
          }
        }
        if (autoField.requestWorkerCache.isNumeric) {
          const num = Number(columnVal)
          // if the number parse results in NaN, somebody probably
          // listed the type erroneously as numeric, so don't use
          // the parsed number
          columnVal = Number.isNaN(num) ? columnVal : num
        } else if (autoField.requestWorkerCache.isArray) {
          // parse array values
          columnVal = columnVal.split(',')
          if (columnVal[columnVal.length - 1] === '') columnVal.pop()
          if (autoField.requestWorkerCache.arrayIsNumeric)
            columnVal = columnVal.map(str => Number(str))
        }

        featureData[snakeCase(autoField.name)] = columnVal
      }
    }

    featureData.strand = { '-': -1, '+': 1 }[featureData.strand] || 0

    return featureData
  }
}

module.exports = BED
