const BED = require('../src')

describe('BED parser', () => {
  let p
  beforeAll(() => {
    p = new BED()
  })

  it('BED3', () => {
    const f1 = p.parseLine('contigA\t10875\t10884')
    const f2 = p.parseLine('co%2CtigA\t10875\t10884')
    expect(f1).toMatchSnapshot()
    expect(f2).toMatchSnapshot()
  })

  it('BED6', () => {
    const f1 = p.parseLine('contigA\t10875\t10884\ttest\t0.50\t-')
    const f2 = p.parseLine('co%2CtigA\t10875\t10884\ttest2\t0\t+')
    const f3 = p.parseLine('cotigA\t10875\t10884\ttest2\t.\t.')
    expect(f1).toMatchSnapshot()
    expect(f2).toMatchSnapshot()
    expect(f3).toMatchSnapshot()
  })
})
