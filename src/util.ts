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
