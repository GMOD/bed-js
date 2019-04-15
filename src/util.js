/*
 * adds some type annotations to the autoSql schema
 * for numeric fields ['uint', 'int', 'float', 'long'] "isNumeric" is added
 * for array types "isArray" is added
 * for numeric array types "isArray" and "arrayIsNumeric" is set
 *
 * @param autoSql - an autoSql schema from the peg parser
 * @return autoSql with type annotations added
 */
export function detectTypes(autoSql) {
  const numericTypes = ['uint', 'int', 'float', 'long']
  const fields = autoSql.fields.map(autoField => {
    const type = {}
    if (!autoField.size && numericTypes.includes(autoField.type)) {
      type.isNumeric = true
    }
    if (autoField.size && autoField.type !== 'char') {
      type.isArray = true
    }
    if (autoField.size && numericTypes.includes(autoField.type)) {
      type.arrayIsNumeric = true
    }
    return { ...autoField, ...type }
  })
  return { ...autoSql, fields }
}

/*
 * regularizes a feature by modifying the {chrom,chromStart,chromEnd} to {refName,start,end}
 * @params featureData a feature to regularize
 * @return a regularized feature
 */
export function regularizeFeat(featureData) {
  const {
    chrom: refName,
    chromStart: start,
    chromEnd: end,
    ...rest
  } = featureData
  return { ...rest, refName, start, end }
}
