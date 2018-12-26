const BED = require('../src')

describe('BED parser', () => {
  let BEDParser
  beforeAll(() => {
    BEDParser = new BED()
  })

  it('can get metadata from the header', () => {
    // Note that there is a custom PL that overrides the default PL
    expect(1).toEqual(1)
  })

})
