// @ts-expect-error
import { parse } from './autoSql'
import { AutoSqlPreSchema } from './util'
import * as types from './as/autoSqlSchemas'

export default Object.fromEntries(
  Object.entries(types).map(([key, value]) => [
    key,
    parse(value.trim()) as AutoSqlPreSchema,
  ]),
)
