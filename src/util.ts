export interface AutoSqlPreSchema {
  fields: { size: number; type: string; name: string; comment: string }[]
}

/*
 * adds some type annotations to the autoSql schema
 * for numeric fields ['uint', 'int', 'float', 'long'] "isNumeric" is added
 * for array types "isArray" is added
 * for numeric array types "isArray" and "arrayIsNumeric" is set
 *
 * @param autoSql - an autoSql schema from the peg parser
 * @return autoSql with type annotations added
 */
export function detectTypes(autoSql: AutoSqlPreSchema) {
  const numericTypes = ['uint', 'int', 'float', 'long']
  return {
    ...autoSql,
    fields: autoSql.fields.map(autoField => ({
      ...autoField,
      isArray: autoField.size && autoField.type !== 'char',
      arrayIsNumeric: autoField.size && numericTypes.includes(autoField.type),
      isNumeric: !autoField.size && numericTypes.includes(autoField.type),
    })),
  }
}

export type AutoSqlSchema = ReturnType<typeof detectTypes>
