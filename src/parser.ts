import parser from './autoSql.js'
import types from './defaultTypes.ts'
import { detectTypes } from './util.ts'

import type { AutoSqlPreSchema, AutoSqlSchema } from './util.ts'

const strandMap = { '.': 0, '-': -1, '+': 1 }

// heuristic that a BED file is BED12 like...the number in col 10 is
// blockCount-like
function isBed12Like(fields: string[]) {
  return (
    fields.length >= 12 &&
    !Number.isNaN(Number.parseInt(fields[9]!, 10)) &&
    fields[10]?.split(',').filter(f => !!f).length ===
      Number.parseInt(fields[9]!, 10)
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
      if (!types[arguments_.type]) {
        throw new Error('Type not found')
      }
      this.autoSql = detectTypes(types[arguments_.type]!)
    } else {
      this.autoSql = detectTypes(types.defaultBedSchema!)
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

    const feature: Record<string, string | number | string[] | number[]> = {}
    if (
      !this.attemptDefaultBed ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (this.attemptDefaultBed && isBed12Like(fields))
    ) {
      for (let index = 0; index < autoSql.fields.length; index++) {
        const autoField = autoSql.fields[index]!
        const rawColumn = fields[index]
        const { isNumeric, isArray, arrayIsNumeric, name } = autoField

        if (rawColumn === undefined) {
          break
        }
        if (rawColumn !== '.') {
          if (isNumeric) {
            const number_ = Number(rawColumn)
            feature[name] = Number.isNaN(number_) ? rawColumn : number_
          } else if (isArray) {
            const parts = rawColumn.split(',')
            if (parts.at(-1) === '') {
              parts.pop()
            }
            feature[name] = arrayIsNumeric ? parts.map(Number) : parts
          } else {
            feature[name] = rawColumn
          }
        }
      }
    } else {
      const fieldNames = ['chrom', 'chromStart', 'chromEnd', 'name']
      for (let i = 0; i < fields.length; i++) {
        feature[fieldNames[i] ?? 'field' + i] = fields[i]!
      }
      feature.chromStart = Number(fields[1]!)
      feature.chromEnd = Number(fields[2]!)
      const field4 = fields[4]
      if (field4 !== undefined && !Number.isNaN(Number.parseFloat(field4))) {
        feature.score = Number.parseFloat(field4)
        delete feature.field4
      }
      const field5 = fields[5]
      if (field5 === '+' || field5 === '-') {
        feature.strand = field5
        delete feature.field5
      }
    }
    if (uniqueId) {
      feature.uniqueId = uniqueId
    }
    feature.strand = strandMap[feature.strand as keyof typeof strandMap] || 0

    feature.chrom = decodeURIComponent(String(feature.chrom))
    return feature
  }
}
