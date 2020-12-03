import parser from '../src/autoSql'

describe('autoSql parser', () => {
  it('simple example', () => {
    const s1 = `table addressBook
		"A simple address book"
    (
    string name;  "Name - first or last or both, we don't care"
    lstring address;  "Street address"
    string city;  "City"
    uint zipCode;  "A zip code is always positive, so can be unsigned"
    char[2] state;  "Just store the abbreviation for the state"
    )`

    const res = parser.parse(s1)
    expect(res).toMatchSnapshot()
  })
  it('resolves symbolic', () => {
    const s1 = `table symbolCols
    "example of enum and set symbolic columns"
    (
    int id;                                          "unique id"
    enum(male, female) sex;                          "enumerated column"
    set(cProg,javaProg,pythonProg,awkProg) skills;   "set column"
    )`
    const res = parser.parse(s1)
    expect(res).toMatchSnapshot()
  })

  it('resolves multiple values', () => {
    const s1 = `
    simple point
    "A three dimensional point"
      (
      float x;  "Horizontal coordinate"
      float y;  "Vertical coordinate"
      float z;  "In/out of screen coordinate"
      )`

    const s2 = `simple color
    "A red/green/blue format color"
      (
      ubyte red;  "Red value 0-255"
      ubyte green; "Green value 0-255"
      ubyte blue;  "Blue value 0-255"
      )`

    const s3 = `object face
    "A face of a three dimensional solid"
      (
      simple color color;  "Color of this face"
      int pointCount;    "Number of points in this polygon"
      uint[pointCount] points;   "Indices of points that make up face in polyhedron point array"
      )`

    const s4 = `table polyhedron
    "A solid three dimensional object"
      (
      int faceCount;  "Number of faces"
      object face[faceCount] faces; "List of faces"
      int pointCount; "Number of points"
      simple point[pointCount] points; "Array of points"
      )`

    expect(parser.parse(s1)).toMatchSnapshot()
    expect(parser.parse(s2)).toMatchSnapshot()
    expect(parser.parse(s3)).toMatchSnapshot()
    expect(parser.parse(s4)).toMatchSnapshot()
  })

  it('real world', () => {
    const s1 = `table hg18KGchr7
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
    expect(parser.parse(s1)).toMatchSnapshot()
  })
  it('clinvar CNV table', () => {
    const s1 = `table clinVarBed
"Browser extensible data (12 fields) plus information about a ClinVar entry"
    (
    string chrom;        "Chromosome (or contig, scaffold, etc.)"
    uint   chromStart;   "Start position in chromosome"
    uint   chromEnd;     "End position in chromosome"
    string name;         "Name of item"
    uint   score;      "Score from 0-1000"
    char[1] strand;    "+ or -"
    uint thickStart;   "Start of where display should be thick (start codon)"
    uint thickEnd;     "End of where display should be thick (stop codon)"
    uint reserved;     "Used as itemRgb as of 2004-11-22"
    int blockCount;    "Number of blocks"
    int[blockCount] blockSizes; "Comma separated list of block sizes"
    int[blockCount] chromStarts; "Start positions relative to chromStart"
    lstring origName;         "ClinVar Variation Report"
    string clinSign;         "Clinical significance"
    string reviewStatus;   "Review Status"
    string type;         "Type of Variant"
    string geneId;         "Gene Symbol"
    string snpId;         "dbSNP ID"
    string nsvId;         "dbVar ID"
    lstring rcvAcc;         "ClinVar Allele Submission"
    string testedInGtr;         "Genetic Testing Registry"
    lstring phenotypeList;         "Phenotypes"
    lstring phenotype;         "Phenotype identifiers"
    string origin;         "Data origin"
    string assembly;         "Genome assembly"
    string cytogenetic;         "Cytogenetic status"
    lstring hgvsCod;         "Nucleotide HGVS"
    lstring hgvsProt;         "Protein HGVS"
    string numSubmit;         "Number of submitters"
    string lastEval;         "Last evaluation"
    string guidelines;         "Guidelines"
    lstring otherIds;         "Other identifiers e.g. OMIM IDs, etc."
    string _mouseOver;         "Mouse over text, not shown"
    )
   `
    expect(parser.parse(s1)).toMatchSnapshot()
  })

  it('pli', () => {
    const s1 = `table pliMetrics
"bed12+5 for displaying gnomAD haploinsufficiency prediction scores"
    (
    string chrom;      "Reference sequence chromosome or scaffold"
    uint   chromStart; "Start position in chromosome"
    uint   chromEnd;   "End position in chromosome"
    string name;       "ENST or ENSG Name"
    uint   score;      "pLI score between 0-1000, or  -1 for NA"
    char[1] strand;    "strand of transcript"
    uint thickStart;   "Start of where display is thick"
    uint thickEnd;     "End of where display should be thick"
    uint itemRgb;    "Color of item"
    int blockCount;   "Number of exons"
    int[blockCount] blockSizes;  "Size of each exon"
    int[blockCount] chromStarts; "0-based start position of each exon"
    string _mouseOver;  "Mouseover label"
    float _pli;         "pLI value for filters"
    string geneName;   "Gene symbol"
    string synonymous; "Synonymous metrics"
    string missense;   "Missense metrics"
    string pLoF;       "Predicted Loss of Function metrics"
    )`
    expect(parser.parse(s1)).toMatchSnapshot()
  })
})
