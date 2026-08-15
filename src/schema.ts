import { autoSqlSchemas } from './as/autoSqlSchemas.ts'
import { parse } from './autoSql.js'

export interface AutoSqlField {
  // fixed-size arrays carry a numeric size (char[2]); variable-length arrays
  // carry the name of the count field (int[blockCount])
  size?: number | string
  type: string
  name: string
  comment: string
  vals?: string[]
}

export interface AutoSqlPreSchema {
  fields: AutoSqlField[]
}

const numericTypes = new Set([
  'uint',
  'int',
  'short',
  'ushort',
  'byte',
  'ubyte',
  'float',
  'double',
  'bigint',
])

export function detectTypes(autoSql: AutoSqlPreSchema) {
  return {
    ...autoSql,
    fields: autoSql.fields.map(autoField => ({
      ...autoField,
      isArray: !!autoField.size && autoField.type !== 'char',
      arrayIsNumeric: !!autoField.size && numericTypes.has(autoField.type),
      isNumeric: !autoField.size && numericTypes.has(autoField.type),
    })),
  }
}

export type AutoSqlSchema = ReturnType<typeof detectTypes>

export function parseAutoSql(text: string) {
  return parse(text) as AutoSqlPreSchema
}

const cache = new Map<string, AutoSqlPreSchema>()

// parsed on first use: parsing every builtin schema up front costs several ms
// of import time for schemas a given consumer never asks for
export function getBuiltinSchema(type: string) {
  let schema = cache.get(type)
  if (!schema) {
    const source = autoSqlSchemas[type]
    if (source === undefined) {
      throw new Error(`Type not found: ${type}`)
    }
    schema = parseAutoSql(source)
    cache.set(type, schema)
  }
  return schema
}
