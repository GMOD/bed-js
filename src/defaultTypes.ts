import * as types from './as/autoSqlSchemas.ts'
import { parse } from './autoSql.js'

import type { AutoSqlPreSchema } from './util.ts'

export default Object.fromEntries(
  Object.entries(types).map(([key, value]) => [
    key,
    parse(value.trim()) as AutoSqlPreSchema,
  ]),
)
