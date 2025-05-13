// @ts-expect-error
import { parse } from './autoSql.js'
import { AutoSqlPreSchema } from './util.ts'
import * as types from './as/autoSqlSchemas.ts'

export default Object.fromEntries(
  Object.entries(types).map(([key, value]) => [
    key,
    parse(value.trim()) as AutoSqlPreSchema,
  ]),
)
