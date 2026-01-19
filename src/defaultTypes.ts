import * as types from './as/autoSqlSchemas.ts'
import parser from './autoSql.js'
import { AutoSqlPreSchema } from './util.ts'

export default Object.fromEntries(
  Object.entries(types).map(([key, value]) => [
    key,
    parser.parse(value.trim()) as AutoSqlPreSchema,
  ]),
)
