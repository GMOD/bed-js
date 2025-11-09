import * as types from './as/autoSqlSchemas.ts'
import parser from './autoSql.ts'
import { AutoSqlPreSchema } from './util.ts'

export default Object.fromEntries(
  Object.entries(types).map(([key, value]) => [
    key,
    // @ts-expect-error
    parser.parse(value.trim()) as AutoSqlPreSchema,
  ]),
)
