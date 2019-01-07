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

describe('bigGenePred', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'bigGenePred' })
  })
  it('bigGenePred', () => {
    const f1 = p.parseLine(
      'chr1\t11868\t14409\tENST00000456328.2\t1000\t+\t11868\t11868\t255,128,0\t3\t359,109,1189,\t0,744,1352,\tDDX11L1\tnone\tnone\t-1,-1,-1,\tnone\tENST00000456328.2\tDDX11L1\tnone',
    )
    const f2 = p.parseLine(
      'chr1\t14403\t29570\tENST00000488147.1\t1000\t-\t14403\t14403\t255,128,0\t11\t98,34,152,159,198,136,137,147,99,154,37,\t0,601,1392,2203,2454,2829,3202,3511,3864,10334,15130,\tWASH7P\tnone\tnone\t-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,\tnone\tENST00000488147.1\tWASH7P\tnone',
    )
    expect(f1).toMatchSnapshot()
    expect(f2).toMatchSnapshot()
  })
})
