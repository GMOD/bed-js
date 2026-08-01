import * as schemas from './as/autoSqlSchemas.ts'
import { parse } from './autoSql.js'

import type { AutoSqlPreSchema } from './util.ts'

const sources: Record<string, string> = schemas
const cache = new Map<string, AutoSqlPreSchema>()

// parsed on first use: parsing every builtin schema up front costs several ms
// of import time for schemas a given consumer never asks for
export function getBuiltinSchema(type: string) {
  let schema = cache.get(type)
  if (!schema) {
    const source = sources[type]
    if (source === undefined) {
      throw new Error(`Type not found: ${type}`)
    }
    schema = parse(source) as AutoSqlPreSchema
    cache.set(type, schema)
  }
  return schema
}
