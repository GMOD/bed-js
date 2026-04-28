export interface AutoSqlPreSchema {
  fields: { size: number; type: string; name: string; comment: string }[]
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
    fields: autoSql.fields
      .map(autoField => ({
        ...autoField,
        isArray: !!autoField.size && autoField.type !== 'char',
        arrayIsNumeric: !!autoField.size && numericTypes.has(autoField.type),
        isNumeric: !autoField.size && numericTypes.has(autoField.type),
      }))

      // this is needed because the autoSql doesn't properly parse comments in the autoSql
      .filter(f => !!f.name),
  }
}

export type AutoSqlSchema = ReturnType<typeof detectTypes>
