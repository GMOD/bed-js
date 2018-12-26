const parser = require('../src/autoSql')

describe('autoSql parser', () => {
  it('resolves symbolic', () => {
    var s1 = `table symbolCols
    "example of enum and set symbolic columns"
    (
    int id;                                          "unique id"
    enum(male, female) sex;                          "enumerated column"
    set(cProg,javaProg,pythonProg,awkProg) skills;   "set column"
    )`
    parser.parse(s1)
  })

})
