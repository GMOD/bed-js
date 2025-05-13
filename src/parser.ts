// @ts-expect-error
import parser from './autoSql.js'
import types from './defaultTypes.ts'
import { detectTypes, AutoSqlSchema, AutoSqlPreSchema } from './util.ts'

const strandMap = { '.': 0, '-': -1, '+': 1 }

// heuristic that a BED file is BED12 like...the number in col 10 is
// blockCount-like
function isBed12Like(fields: string[]) {
  return (
    fields.length >= 12 &&
    !Number.isNaN(Number.parseInt(fields[9], 10)) &&
    fields[10]?.split(',').filter(f => !!f).length ===
      Number.parseInt(fields[9], 10)
  )
}
export default class BED {
  public autoSql: AutoSqlSchema

  private attemptDefaultBed?: boolean

  constructor(arguments_: { autoSql?: string; type?: string } = {}) {
    if (arguments_.autoSql) {
      this.autoSql = detectTypes(
        parser.parse(arguments_.autoSql) as AutoSqlPreSchema,
      )
    } else if (arguments_.type) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!types[arguments_.type]) {
        throw new Error('Type not found')
      }
      this.autoSql = detectTypes(types[arguments_.type])
    } else {
      this.autoSql = detectTypes(types.defaultBedSchema)
      this.attemptDefaultBed = true
    }
  }

  /*
   * parses a line of text as a BED line with the loaded autoSql schema
   *
   * @param line - a BED line as tab delimited text or array
   * @param opts - supply opts.uniqueId
   * @return a object representing a feature
   */
  parseLine(line: string | string[], options: { uniqueId?: string } = {}) {
    const { autoSql } = this
    const { uniqueId } = options
    const fields = Array.isArray(line) ? line : line.split('\t')

    let feature = {} as Record<string, any>
    if (
      !this.attemptDefaultBed ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (this.attemptDefaultBed && isBed12Like(fields))
    ) {
      for (let index = 0; index < autoSql.fields.length; index++) {
        const autoField = autoSql.fields[index]
        let columnValue: any = fields[index]
        const { isNumeric, isArray, arrayIsNumeric, name } = autoField
        if (columnValue === null || columnValue === undefined) {
          break
        }
        if (columnValue !== '.') {
          if (isNumeric) {
            const number_ = Number(columnValue)
            columnValue = Number.isNaN(number_) ? columnValue : number_
          } else if (isArray) {
            columnValue = columnValue.split(',')
            if (columnValue.at(-1) === '') {
              columnValue.pop()
            }
            if (arrayIsNumeric) {
              columnValue = columnValue.map(Number)
            }
          }

          feature[name] = columnValue
        }
      }
    } else {
      const fieldNames = ['chrom', 'chromStart', 'chromEnd', 'name']
      feature = Object.fromEntries(
        fields.map((f, index) => [fieldNames[index] || 'field' + index, f]),
      )
      feature.chromStart = +feature.chromStart
      feature.chromEnd = +feature.chromEnd
      if (!Number.isNaN(Number.parseFloat(feature.field4))) {
        feature.score = +feature.field4
        delete feature.field4
      }
      if (feature.field5 === '+' || feature.field5 === '-') {
        feature.strand = feature.field5
        delete feature.field5
      }
    }
    if (uniqueId) {
      feature.uniqueId = uniqueId
    }
    feature.strand = strandMap[feature.strand as keyof typeof strandMap] || 0

    feature.chrom = decodeURIComponent(feature.chrom)
    return feature
  }
}
