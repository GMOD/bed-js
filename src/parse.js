const snakeCase = require('snake-case')
const parser = require('./autoSql')
const types = require('./defaultTypes')

/**
 * Class representing a BED parser
 * @param {object} args
 */
class BED {
  constructor(args = {}) {
    if (args.autoSql) {
      this.format = parser(args.autoSql)
    } else if (args.type) {
      if (types[args.type]) {
        this.format = types[args.type]
      }
    }
  }

  parseBedText(start, end, rest, asql, offset = 0) {
    // include ucsc-style names as well as jbrowse-style names
    const featureData = {
      start,
      end,
    }

    const bedColumns = Array.isArray(rest) ? rest : rest.split('\t')
    const numericTypes = ['uint', 'int', 'float', 'long']
    // first three columns (chrom,start,end) are not included in bigBed
    for (let i = offset; i < asql.fields.length; i += 1) {
      if (bedColumns[i - offset] !== '.' && bedColumns[i - offset] !== '') {
        const autoField = asql.fields[i]
        let columnVal = bedColumns[i - offset]

        // for speed, cache some of the tests we need inside the autofield definition
        if (!autoField._requestWorkerCache) {
          autoField._requestWorkerCache = {
            isNumeric: !autoField.size && numericTypes.includes(autoField.type),
            isArray: autoField.size,
            arrayIsNumeric:
              autoField.size && numericTypes.includes(autoField.type),
          }
        }
        if (autoField._requestWorkerCache.isNumeric) {
          const num = Number(columnVal)
          // if the number parse results in NaN, somebody probably
          // listed the type erroneously as numeric, so don't use
          // the parsed number
          columnVal = Number.isNaN(num) ? columnVal : num
        } else if (autoField._requestWorkerCache.isArray) {
          // parse array values
          columnVal = columnVal.split(',')
          if (columnVal[columnVal.length - 1] === '') columnVal.pop()
          if (autoField._requestWorkerCache.arrayIsNumeric)
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
