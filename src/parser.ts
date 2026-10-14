import { parse } from './autoSql.ts'
import { countListItems, numberList, toNumber } from './numbers.ts'
import {
  detectTypes,
  getBuiltinSchema,
  schemaFromColumnNames,
} from './schema.ts'

import type { AutoSqlSchema } from './schema.ts'

export type Feature = Record<string, string | number | string[] | number[]>

type DetectedField = AutoSqlSchema['fields'][number]

function parseStrand(strand: unknown) {
  if (typeof strand === 'number') {
    return Math.sign(strand) || 0
  }
  return strand === '+' ? 1 : strand === '-' ? -1 : 0
}

// decodes only well-formed %XX escapes: decodeURIComponent throws on a contig
// named like "chr%_test"
function decodeChrom(chrom: string) {
  return chrom.includes('%')
    ? chrom.replace(/%([0-9A-Fa-f]{2})/g, (_, hex: string) =>
        String.fromCharCode(Number.parseInt(hex, 16)),
      )
    : chrom
}

// column 10 is a count matching the number of block sizes in column 11
function isBed12Like(fields: string[]) {
  if (fields.length < 12) {
    return false
  }
  const blockCount = Number.parseInt(fields[9]!, 10)
  return !Number.isNaN(blockCount) && countListItems(fields[10]!) === blockCount
}

function parseColumn(rawColumn: string, field: DetectedField) {
  if (field.isNumeric) {
    if (rawColumn === '') {
      return undefined
    }
    const num = toNumber(rawColumn)
    return Number.isNaN(num) ? rawColumn : num
  } else if (field.isArray) {
    if (field.arrayIsNumeric) {
      return numberList(rawColumn)
    }
    const parts = rawColumn.split(',')
    if (parts.at(-1) === '') {
      parts.pop()
    }
    return parts
  } else {
    return rawColumn
  }
}

// columns whose meaning we can only guess at, for a line that doesn't look
// like BED12: score and strand are recognized by their contents, everything
// else keeps its column number
function parseGuessedBed(fields: string[]) {
  const feature: Feature = {}
  feature.chrom = fields[0]!
  feature.chromStart = toNumber(fields[1])
  feature.chromEnd = toNumber(fields[2])
  if (fields[3] !== undefined) {
    feature.name = fields[3]
  }
  const field4 = fields[4]
  if (field4 !== undefined) {
    const asNum = field4 === '' ? Number.NaN : toNumber(field4)
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
  return feature
}

export default class BED {
  public autoSql: AutoSqlSchema

  private readonly attemptDefaultBed: boolean

  constructor(
    opts: { autoSql?: string; type?: string; columnNames?: string[] } = {},
  ) {
    const { autoSql, type, columnNames } = opts
    this.attemptDefaultBed = !autoSql && !type && !columnNames?.length
    this.autoSql = detectTypes(
      autoSql
        ? parse(autoSql)
        : columnNames?.length
          ? schemaFromColumnNames(columnNames)
          : getBuiltinSchema(type ?? 'defaultBedSchema'),
    )
  }

  parseLine(line: string | string[], options: { uniqueId?: string } = {}) {
    const { uniqueId } = options
    const fields = Array.isArray(line) ? line : line.split('\t')

    const feature =
      this.attemptDefaultBed && !isBed12Like(fields)
        ? parseGuessedBed(fields)
        : this.parseWithSchema(fields)

    if (uniqueId !== undefined) {
      feature.uniqueId = uniqueId
    }
    feature.strand = parseStrand(feature.strand)

    const { chrom } = feature
    if (typeof chrom === 'string') {
      feature.chrom = decodeChrom(chrom)
    }
    return feature
  }

  private parseWithSchema(fields: string[]) {
    const schemaFields = this.autoSql.fields
    const feature: Feature = {}
    const end = Math.min(fields.length, schemaFields.length)
    for (let index = 0; index < end; index++) {
      const rawColumn = fields[index]!
      if (rawColumn !== '.') {
        const field = schemaFields[index]!
        const value = parseColumn(rawColumn, field)
        if (value !== undefined) {
          feature[field.name] = value
        }
      }
    }
    // BED12+n: the schema stops at column 12 but the trailing columns are
    // still data, so keep them the way the guessed-BED path names its own
    if (this.attemptDefaultBed) {
      for (let index = schemaFields.length; index < fields.length; index++) {
        feature['field' + index] = fields[index]!
      }
    }
    return feature
  }
}
