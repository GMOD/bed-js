import { test, expect } from 'vitest'
import BED from '../src/index.ts'

test('BED3', () => {
  const p = new BED()
  const f1 = p.parseLine('contigA\t10875\t10884')
  const f2 = p.parseLine('co%2CtigA\t10875\t10884')
  const f3 = p.parseLine(['contigA', '10875', '10884'])
  expect(f1).toMatchSnapshot()
  expect(f2).toMatchSnapshot()
  expect(f3).toEqual(f1)
})

test('errors', () => {
  expect(() => new BED({ type: 'notexist' })).toThrow(/not found/)
})

test('BED6', () => {
  const p = new BED()
  const f1 = p.parseLine('contigA\t10875\t10884\ttest\t0.50\t-')
  const f2 = p.parseLine('co%2CtigA\t10875\t10884\ttest2\t0\t+')
  const f3 = p.parseLine('cotigA\t10875\t10884\ttest2\t.\t.')
  expect(f1).toMatchSnapshot()
  expect(f2).toMatchSnapshot()
  expect(f3).toMatchSnapshot()
  expect(f2.chrom).toEqual('co,tigA')
  expect(f2.chromStart).toEqual(10_875)
  expect(f2.chromEnd).toEqual(10_884)
  expect(f3.strand).toEqual(0)
})
test('BED12', () => {
  const p = new BED()
  const f1 = p.parseLine(
    'chr22\t1000\t5000\tcloneA\t960\t+\t1000\t5000\t0\t2\t567,488,\t0,3512',
  )
  const f2 = p.parseLine(
    'chr22\t2000\t6000\tcloneB\t900\t-\t2000\t6000\t0\t2\t433,399,\t0,3601',
  )
  expect(f1).toMatchSnapshot()
  expect(f2).toMatchSnapshot()
})

// this example comes from the LRA aligner preprint, it is BED format but the
// fields not really standard
test('BED weird', () => {
  const p = new BED()
  const line = `1	25608494	25737913	.	96.44058642	SRHB01000779.1	24831980	D`

  expect(p.parseLine(line)).toMatchSnapshot()
})

test('bigGenePred', () => {
  const p = new BED({ type: 'bigGenePred' })
  const f1 = p.parseLine(
    'chr1\t11868\t14409\tENST00000456328.2\t1000\t+\t11868\t11868\t255,128,0\t3\t359,109,1189,\t0,744,1352,\tDDX11L1\tnone\tnone\t-1,-1,-1,\tnone\tENST00000456328.2\tDDX11L1\tnone',
  )
  const f2 = p.parseLine(
    'chr1\t14403\t29570\tENST00000488147.1\t1000\t-\t14403\t14403\t255,128,0\t11\t98,34,152,159,198,136,137,147,99,154,37,\t0,601,1392,2203,2454,2829,3202,3511,3864,10334,15130,\tWASH7P\tnone\tnone\t-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,\tnone\tENST00000488147.1\tWASH7P\tnone',
  )
  expect(f1).toMatchSnapshot()
  expect(f2).toMatchSnapshot()
})

test('bigPsl', () => {
  const p = new BED({ type: 'bigPsl' })
  const f1 = p.parseLine(
    'chr1\t11873\t14361\tmAM992877\t1000\t+\t11873\t14361\t0\t3\t354,109,1141,\t0,739,1347,\t0\t1604\t+\t1604\t0,354,463,\t\t\t248956422\t1579\t25\t0\t0\t0',
  )
  const f2 = p.parseLine(
    'chr1\t11873\t14361\tmAM992877\t1000\t+\t12622\t13259\t0\t3\t354,109,1141,\t0,739,1347,\t0\t1604\t+\t1604\t0,354,463,\tcttgccgtcagccttttctttgacctcttctttctgttcatgtgtatctgctgtctcttagcccagacttcccgtgtcctttccaccgggcctttgggaggtcacagggtcttgatgctgtggtcttgatctgcaggtgtctgacttccagcaactgctggcctgtgccagggtggaagctgagcactggagtggagttttcctgtggagaggagccatgcctagagtgggatgggccattgttcatattctggcccctgttgtctgcatgtaacctaataccacgaccaggcatgggggaaagattggaggaaagttgagtgagaggatcaacttctctgacaacctaggccagtgtgtggtgatgccaggcatgcccttccccagcatcaggtctccagagctgcagaagacgacggccgacttggatcacactcttgtgagtgtccccagtgttgcagaggcagggccatcaggcaccaaagggattctgccagcatagtgctcctggaccagtgatacacccggcaccctgtcctggacaggctgttggcctggatctgagccctcgtggaggtcaaagccacctttggttctgccattactgctgtgtggaagttcactcctgccttttcctttcccgagagcctccaccaccccgagatcgcatttctcactgccttttgtctgcccagtttcaccagaagtaggcctcttcctgacaggcagctgcaccactgcctggcgctgcgcccttcctttgctctgcccgctggagacggtgtttgtcatgggcctggtctgcagggatcctgctacaaaggtgaaacccaggagagtgtggagtccagagtgttgccaggacccaggcacaggcattagtgcccgttggagaaaacaggggaatcccgaagaaatggtgggttttggccatccgtgagatcttcccagggcagctcccctctgtggaatccaatctgtcttccatcctgcgtggccgagggccaggcttctcactgggcctctgcaggaggctgccatttgtcctgcccaccgtcttagaagcgagacggagcagactcatctgctactgccctttctataataactaaagttagctgccctggactattcaccccctagtctcaatttaaaaagatccccatggccacagggcccctgcctgggggcttgtcacctcccccaccttcttcctgagtcacttctgcagccttgctccctaacctgccccacagccttgcctggatttctatctccctggcttggtgccagttcctccaagtcgatggcacctccctccctctcaaccacttgagcaaactccaagacatcttctaccccaacaccagcaattgtgccaagggccattaggctctcagcatgactatttttagagaccccgtgtctgtcactgaaaccttttttgtgggagactattcctcccatctgcaacagctgcccctgctgacggcccttctctcctccctctcatcccagagaaacaggtcagctgggagcttctgcccccactgcctagggaccaacaggggcaggaggcagtcactgaccccgagacgtttgca\t365..502\t248956422\t1579\t25\t0\t0\t1',
  )
  expect(f1).toMatchSnapshot()
  expect(f2).toMatchSnapshot()
})

test('bigMaf', () => {
  const p = new BED({ type: 'bigMaf' })
  const f1 = p.parseLine(
    'chr22_KI270731v1_random\t0\t2\ta score=60.000000;s hg38.chr22_KI270731v1_random        0 2 +   150754 AC;s canFam3.chr26                27974205 2 + 38964690 AT;',
  )
  expect(f1).toMatchSnapshot()
})

test('mafSummary', () => {
  const p = new BED({ type: 'mafSummary' })
  const f1 = p.parseLine(
    'chr22_KI270731v1_random\t0\t9270\tcanFam3\t0.568679\t\t',
  )
  expect(f1).toMatchSnapshot()
})

test('mafFrames', () => {
  const p = new BED({ type: 'mafFrames' })

  const f1 = p.parseLine(
    'chr22_KI270731v1_random\t11287\t12574\thg38\t0\t-\tENST00000619792.1\t-1\t-1\t1\t1',
  )
  expect(f1).toMatchSnapshot()
})

test('bigInteract', () => {
  const p = new BED({ type: 'bigInteract' })

  const f1 = p.parseLine(
    'chr3\t63702628\t63705638\t.\t584\t10\t.\t0\tchr17\t58878552\t58880897\t.\t.\tchr3\t63702628\t63705638\t.\t.',
  )
  expect(f1).toMatchSnapshot()
})

test('bigChain', () => {
  const p = new BED({ type: 'bigChain' })

  const f1 = p.parseLine(
    'chr22_KI270731v1_random\t133689\t133710\t530549\t1000\t-\t150754\tchr16\t98207768\t80144720\t80144725\t66',
  )
  expect(f1).toMatchSnapshot()
})

test('bigLink', () => {
  const p = new BED({ type: 'bigLink' })
  const f1 = p.parseLine('chr22_KI270731v1_random\t7917\t7918\t2912\t75185566')
  expect(f1).toMatchSnapshot()
})

test('bigNarrowPeak', () => {
  const p = new BED({ type: 'bigNarrowPeak' })

  expect(
    p.parseLine(
      'chr1\t566753\t566953\t.\t468\t.\t103.84\t5.54347\t4.80079\t154',
    ),
  ).toMatchSnapshot()
  expect(
    p.parseLine(
      'chr1\t566753\t566953\t.\t468\t.\t103.84\t5.54347\t4.80079\t154',
      { uniqueId: '1' },
    ),
  ).toMatchSnapshot()
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

test('gdc cancer', () => {
  const autoSql = `table gdcCancer
"somatic variants converted from MAF files obtained through the NCI GDC"
    (
    string chrom;      "Chromosome (or contig, scaffold, etc.)"
    uint   chromStart; "Start position in chromosome"
    uint   chromEnd;   "End position in chromosome"
    string name;       "Name of item"
    uint   score;      "Score from 0-1000"
    char[1] strand;    "+ or -"
    uint thickStart;   "Start of where display should be thick (start codon)"
    uint thickEnd;     "End of where display should be thick (stop codon)"
    uint reserved;     "Used as itemRgb as of 2004-11-22"
    int blockCount;    "Number of blocks"
    int[blockCount] blockSizes; "Comma separated list of block sizes"
    int[blockCount] chromStarts; "Start positions relative to chromStart"
    string sampleCount;    "Number of samples with this variant"
    string freq;                    "Variant frequency"
    lstring Hugo_Symbol;            "Hugo symbol"
    lstring Entrez_Gene_Id;         "Entrez Gene Id"
    lstring Variant_Classification; "Class of variant"
    lstring Variant_Type;           "Type of variant"
    lstring Reference_Allele;       "Reference allele"
    lstring Tumor_Seq_Allele1;      "Tumor allele 1"
    lstring Tumor_Seq_Allele2;      "Tumor allele 2"
    lstring dbSNP_RS;               "dbSNP RS number"
    lstring dbSNP_Val_Status;       "dbSNP validation status"
    lstring days_to_death;          "Number of days till death"
    lstring cigarettes_per_day;     "Number of cigarettes per day"
    lstring weight;                 "Weight"
    lstring alcohol_history;        "Any alcohol consumption?"
    lstring alcohol_intensity;      "Frequency of alcohol consumption"
    lstring bmi;                    "Body mass index"
    lstring years_smoked;           "Number of years smoked"
    lstring height;                 "Height"
    lstring gender;                 "Gender"
    lstring project_id;             "TCGA Project id"
    lstring ethnicity;              "Ethnicity"
    lstring Tumor_Sample_Barcode;   "Tumor sample barcode"
    lstring Matched_Norm_Sample_Barcode;  "Matcheds normal sample barcode"
    lstring case_id;                "Case ID number"
)`
  const p = new BED({ autoSql })
  const returnValue = p.parseLine(
    'chr1\t1\t10\tT>G\t1\t.\t1815756\t1815757\t0,0,0\t1\t1\t0\t1\t0.0108695652174\tGNB1\t2782\tSplice_Region\tSNP\tT\tT\tG\tnovel\t\t--\t--\t--\t--\t--\t--\t--\t--\tfemale\tTCGA-ACC\tnot hispanic or latino\tTCGA-OR-A5KB-01A-11D-A30A-10\tTCGA-OR-A5KB-11A-11D-A30A-10\t09454ed6-64bc-4a35-af44-7c4344623d45',
  )
  expect(returnValue).toMatchSnapshot()
})
