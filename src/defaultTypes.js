import parser from './index'
import * as types from './as/autoSqlSchemas'

Object.keys(types).forEach((k) => {
  types[k] = parser.parse(types[k].trim())
})

export default types
