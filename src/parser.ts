import { parse } from './autoSql.js'
import types from './defaultTypes.ts'
import { detectTypes } from './util.ts'

import type { AutoSqlPreSchema, AutoSqlSchema } from './util.ts'

const strandMap = { '.': 0, '-': -1, '+': 1 }

// heuristic that a BED file is BED12 like...the number in col 10 is
// blockCount-like
function isBed12Like(fields: string[]) {
  const blockCount = Number.parseInt(fields[9]!, 10)
  return (
    fields.length >= 12 &&
    !Number.isNaN(blockCount) &&
    fields[10]?.split(',').filter(f => f).length === blockCount
  )
}
export default class BED {
  public autoSql: AutoSqlSchema

  private attemptDefaultBed?: boolean

  constructor(opts: { autoSql?: string; type?: string } = {}) {
    if (opts.autoSql) {
      this.autoSql = detectTypes(parse(opts.autoSql) as AutoSqlPreSchema)
    } else if (opts.type) {
      if (!types[opts.type]) {
        throw new Error('Type not found')
      }
      this.autoSql = detectTypes(types[opts.type]!)
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
    if (!this.attemptDefaultBed || isBed12Like(fields)) {
      for (let index = 0; index < autoSql.fields.length; index++) {
        const autoField = autoSql.fields[index]!
        const rawColumn = fields[index]
        const { isNumeric, isArray, arrayIsNumeric, name } = autoField

        if (rawColumn === undefined) {
          break
        }
        if (rawColumn !== '.') {
          if (isNumeric) {
            const num = Number(rawColumn)
            feature[name] = Number.isNaN(num) ? rawColumn : num
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
      feature.chrom = fields[0]!
      feature.chromStart = Number(fields[1])
      feature.chromEnd = Number(fields[2])
      if (fields[3] !== undefined) {
        feature.name = fields[3]
      }
      const field4 = fields[4]
      if (field4 !== undefined) {
        const asNum = Number.parseFloat(field4)
        if (Number.isNaN(asNum)) {
          feature.field4 = field4
        } else {
          feature.score = asNum
        }
      }
      const field5 = fields[5]
      if (field5 !== undefined) {
        feature[field5 === '+' || field5 === '-' ? 'strand' : 'field5'] = field5
      }
      for (let i = 6; i < fields.length; i++) {
        feature['field' + i] = fields[i]!
      }
    }
    if (uniqueId) {
      feature.uniqueId = uniqueId
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    feature.strand = strandMap[feature.strand as keyof typeof strandMap] ?? 0

    feature.chrom = decodeURIComponent(String(feature.chrom))
    return feature
  }
}
