import BED from '../src'

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
    expect(f2.chrom).toEqual('co,tigA')
    expect(f2.chromStart).toEqual(10875)
    expect(f2.chromEnd).toEqual(10884)
  })
  it('BED12', () => {
    const f1 = p.parseLine(
      'chr22\t1000\t5000\tcloneA\t960\t+\t1000\t5000\t0\t2\t567,488,\t0,3512',
    )
    const f2 = p.parseLine(
      'chr22\t2000\t6000\tcloneB\t900\t-\t2000\t6000\t0\t2\t433,399,\t0,3601',
    )
    expect(f1).toMatchSnapshot()
    expect(f2).toMatchSnapshot()
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

describe('bigPsl', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'bigPsl' })
  })
  it('bigPsl', () => {
    const f1 = p.parseLine(
      'chr1\t11873\t14361\tmAM992877\t1000\t+\t11873\t14361\t0\t3\t354,109,1141,\t0,739,1347,\t0\t1604\t+\t1604\t0,354,463,\t\t\t248956422\t1579\t25\t0\t0\t0',
    )
    const f2 = p.parseLine(
      'chr1\t11873\t14361\tmAM992877\t1000\t+\t12622\t13259\t0\t3\t354,109,1141,\t0,739,1347,\t0\t1604\t+\t1604\t0,354,463,\tcttgccgtcagccttttctttgacctcttctttctgttcatgtgtatctgctgtctcttagcccagacttcccgtgtcctttccaccgggcctttgggaggtcacagggtcttgatgctgtggtcttgatctgcaggtgtctgacttccagcaactgctggcctgtgccagggtggaagctgagcactggagtggagttttcctgtggagaggagccatgcctagagtgggatgggccattgttcatattctggcccctgttgtctgcatgtaacctaataccacgaccaggcatgggggaaagattggaggaaagttgagtgagaggatcaacttctctgacaacctaggccagtgtgtggtgatgccaggcatgcccttccccagcatcaggtctccagagctgcagaagacgacggccgacttggatcacactcttgtgagtgtccccagtgttgcagaggcagggccatcaggcaccaaagggattctgccagcatagtgctcctggaccagtgatacacccggcaccctgtcctggacaggctgttggcctggatctgagccctcgtggaggtcaaagccacctttggttctgccattactgctgtgtggaagttcactcctgccttttcctttcccgagagcctccaccaccccgagatcgcatttctcactgccttttgtctgcccagtttcaccagaagtaggcctcttcctgacaggcagctgcaccactgcctggcgctgcgcccttcctttgctctgcccgctggagacggtgtttgtcatgggcctggtctgcagggatcctgctacaaaggtgaaacccaggagagtgtggagtccagagtgttgccaggacccaggcacaggcattagtgcccgttggagaaaacaggggaatcccgaagaaatggtgggttttggccatccgtgagatcttcccagggcagctcccctctgtggaatccaatctgtcttccatcctgcgtggccgagggccaggcttctcactgggcctctgcaggaggctgccatttgtcctgcccaccgtcttagaagcgagacggagcagactcatctgctactgccctttctataataactaaagttagctgccctggactattcaccccctagtctcaatttaaaaagatccccatggccacagggcccctgcctgggggcttgtcacctcccccaccttcttcctgagtcacttctgcagccttgctccctaacctgccccacagccttgcctggatttctatctccctggcttggtgccagttcctccaagtcgatggcacctccctccctctcaaccacttgagcaaactccaagacatcttctaccccaacaccagcaattgtgccaagggccattaggctctcagcatgactatttttagagaccccgtgtctgtcactgaaaccttttttgtgggagactattcctcccatctgcaacagctgcccctgctgacggcccttctctcctccctctcatcccagagaaacaggtcagctgggagcttctgcccccactgcctagggaccaacaggggcaggaggcagtcactgaccccgagacgtttgca\t365..502\t248956422\t1579\t25\t0\t0\t1',
    )
    expect(f1).toMatchSnapshot()
    expect(f2).toMatchSnapshot()
  })
})
// bigMaf
//
describe('bigMaf', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'bigMaf' })
  })
  it('bigMaf', () => {
    const f1 = p.parseLine(
      'chr22_KI270731v1_random\t0\t2\ta score=60.000000;s hg38.chr22_KI270731v1_random        0 2 +   150754 AC;s canFam3.chr26                27974205 2 + 38964690 AT;',
    )
    expect(f1).toMatchSnapshot()
  })
})

describe('mafSummary', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'mafSummary' })
  })
  it('mafSummary', () => {
    const f1 = p.parseLine(
      'chr22_KI270731v1_random\t0\t9270\tcanFam3\t0.568679\t\t',
    )
    expect(f1).toMatchSnapshot()
  })
})

describe('mafFrames', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'mafFrames' })
  })

  it('mafFrames', () => {
    const f1 = p.parseLine(
      'chr22_KI270731v1_random\t11287\t12574\thg38\t0\t-\tENST00000619792.1\t-1\t-1\t1\t1',
    )
    expect(f1).toMatchSnapshot()
  })
})

describe('bigInteract', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'bigInteract' })
  })

  it('bigInteract', () => {
    const f1 = p.parseLine(
      'chr3\t63702628\t63705638\t.\t584\t10\t.\t0\tchr17\t58878552\t58880897\t.\t.\tchr3\t63702628\t63705638\t.\t.',
    )
    expect(f1).toMatchSnapshot()
  })
})

describe('bigChain', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'bigChain' })
  })

  it('bigChain', () => {
    const f1 = p.parseLine(
      'chr22_KI270731v1_random\t133689\t133710\t530549\t1000\t-\t150754\tchr16\t98207768\t80144720\t80144725\t66',
    )
    expect(f1).toMatchSnapshot()
  })
})

describe('bigLink', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'bigLink' })
  })

  it('bigLink', () => {
    const f1 = p.parseLine(
      'chr22_KI270731v1_random\t7917\t7918\t2912\t75185566',
    )
    expect(f1).toMatchSnapshot()
  })
})

describe('bigNarrowPeak', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'bigNarrowPeak' })
  })

  it('bigNarrowPeak', () => {
    const f1 = p.parseLine(
      'chr1\t566753\t566953\t.\t468\t.\t103.84\t5.54347\t4.80079\t154',
    )
    expect(f1).toMatchSnapshot()
  })
})
describe('bigNarrowPeak with regularize', () => {
  let p
  beforeAll(() => {
    p = new BED({ type: 'bigNarrowPeak' })
  })

  it('bigNarrowPeak', () => {
    const f1 = p.parseLine(
      'chr1\t566753\t566953\t.\t468\t.\t103.84\t5.54347\t4.80079\t154',
      { regularize: true },
    )
    expect(f1).toMatchSnapshot()
  })
})
test('real world', () => {
  const autoSql = `table hg18KGchr7
    "UCSC Genes for chr7 with color plus GeneSymbol and SwissProtID"
    (
    string  chrom;              "Reference sequence chromosome or scaffold"
    uint    chromStart; "Start position of feature on chromosome"
    uint    chromEnd;   "End position of feature on chromosome"
    string  name;               "Name of gene"
    uint    score;              "Score"
    char[1] strand;             "+ or - for strand"
    uint    thickStart; "Coding region start"
    uint    thickEnd;   "Coding region end"
    uint        reserved;       "Green on + strand, Red on - strand"
    string  geneSymbol; "Gene Symbol"
    string  spID;               "SWISS-PROT protein Accession number"
    )`
  const p = new BED({ autoSql })
  expect(p.autoSql).toMatchSnapshot()
})

test('generate README output', () => {
  const p = new BED()
  const f1 = p.parseLine('chr1\t0\t100')
  // outputs { chrom: 'chr1', chromStart: 0, chromEnd: 100 }
  const f2 = p.parseLine('chr1\t0\t100', { regularize: true, uniqueId: 1 })
  // outputs { uniqueId: 1, refName: 'chr1', start: 0, end: 100 }
  console.log(f1)
  console.log(f2)
  // console.log(p.parseLine('chr1\t0\t100'))
  // const p2 = new BED({ type: 'bigGenePred' })
  // const line =
  //   'chr1\t11868\t14409\tENST00000456328.2\t1000\t+\t11868\t11868\t255,128,0\t3\t359,109,1189,\t0,744,1352,\tDDX11L1\tnone\tnone\t-1,-1,-1,\tnone\tENST00000456328.2\tDDX11L1\tnone'
  // console.log(p2.parseLine(line))
})
