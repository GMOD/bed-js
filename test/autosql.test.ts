import { describe, expect, it, test } from 'vitest'

import { parse } from '../src/autoSql.js'

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

    const res = parse(s1)
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
    const res = parse(s1)
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

    expect(parse(s1)).toMatchSnapshot()
    expect(parse(s2)).toMatchSnapshot()
    expect(parse(s3)).toMatchSnapshot()
    expect(parse(s4)).toMatchSnapshot()
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
    expect(parse(s1)).toMatchSnapshot()
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
    expect(parse(s1)).toMatchSnapshot()
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
    expect(parse(s1)).toMatchSnapshot()
  })

  // field-level index/auto modifiers from kent/src/hg/autoSql/doc.as and tests/input/index.as
  test('field index and auto modifiers', () => {
    const table = `table addressBook
"A simple address book"
    (
    int id primary auto;  "Auto increment primary key"
    string name unique;  "Name"
    string city index[6];  "City - indexed on first 6 chars"
    uint zipCode index;  "Zip code"
    char[2] state;  "State abbreviation"
    set(cProg,javaProg) skills index;  "Skills"
    )`
    expect(parse(table)).toMatchSnapshot()
  })

  // seen in https://hgdownload.soe.ucsc.edu/gbdb/hg38/gnomAD/v4.1/exomes/exomes.bb
  // table comment has trailing space after closing quote, field comments have trailing whitespace
  test('bigInt type (camelCase) and trailing whitespace in comments', () => {
    const table = `table gnomadGenomes
"gnomAD v4.1 exomes variant data"
    (
    string chrom;      "Chromosome (or contig, scaffold, etc.)"
    uint   chromStart; "Start position in chromosome"
    bigInt _dataOffset; "Offset into gnomad.v4.1.details.tab.gz for line with more info"
    int _dataLen; "Length of the line in gnomad.v4.1.details.tab.gz"
    )`
    const result = parse(table) as {
      comment: string
      fields: { comment: string }[]
    }
    expect(result.comment).toBe('gnomAD v4.1 exomes variant data')
    expect(result.fields[0]!.comment).toBe(
      'Chromosome (or contig, scaffold, etc.)',
    )
    expect(result.fields[1]!.comment).toBe('Start position in chromosome')
  })

  // seen in https://hgdownload.soe.ucsc.edu/gbdb/hg38/clinvarSubLolly/clinvarSubLolly.bb
  test('comment', () => {
    const table = `table clinsub
"Clinvar Submissions"
    (
    #bed 9
    string chrom;      "Chromosome (or contig, scaffold, etc.)"
    uint   chromStart; "Start position in chromosome"
    uint   chromEnd;   "End position in chromosome"
    string name;       "Name of item"
    uint   score;      "Score from 0-1000"
    char[1] strand;    "+ or -"
    uint thickStart;   "Start of where display should be thick (start codon)"
    uint thickEnd;     "End of where display should be thick (stop codon)"
    uint reserved;     "Used as itemRgb as of 2004-11-22"

    #extra fields
    uint lollySize;    "Size of lollipop"
    lstring changes;     "changes
    lstring variantIds;     "variantIds
    lstring subIds;     "subIds
    lstring _mouseOver;     "mouseOver"
    )`

    expect(parse(table)).toMatchSnapshot()
  })

  // verify the nonQuotedString trim fix: trailing space before closing " must be stripped
  test('trailing whitespace stripped from comments', () => {
    // prettier-ignore
    const table =
      'table foo\n' +
      '"table comment" \n' +
      '(\n' +
      'string x; "field comment" \n' +
      'uint y;   "no trailing space"\n' +
      ')'
    const result = parse(table) as {
      comment: string
      fields: { comment: string }[]
    }
    expect(result.comment).toBe('table comment')
    expect(result.fields[0]!.comment).toBe('field comment')
    expect(result.fields[1]!.comment).toBe('no trailing space')
  })

  test('auto without preceding index', () => {
    const table = `table t
"test"
    (
    int id auto;   "auto without primary/index"
    string name;   "name"
    )`
    const result = parse(table) as { fields: { name: string }[] }
    expect(result.fields.map(f => f.name)).toEqual(['id', 'name'])
  })

  test('index and auto modifiers are case sensitive', () => {
    const reject = (input: string) => {
      expect(() => parse(input)).toThrow()
    }
    reject('table t "x" ( int id PRIMARY; "pk" )')
    reject('table t "x" ( int id AUTO; "auto" )')
    reject('table t "x" ( string city INDEX; "idx" )')
    reject('table t "x" ( string city UNIQUE; "u" )')
  })

  test('SIMPLE and OBJECT declaration types are case insensitive', () => {
    const simple = `SIMPLE point
"A point"
    (
    float x; "x"
    float y; "y"
    )`
    const obj = `OBJECT face
"A face"
    (
    int count; "count"
    )`
    expect((parse(simple) as { type: string }).type).toBe('simple')
    expect((parse(obj) as { type: string }).type).toBe('object')
  })

  test('case insensitive keywords', () => {
    const table = `TABLE mixedCase
"Case insensitivity smoke test"
    (
    INT chromStart;    "signed int"
    UINT chromEnd;     "unsigned int"
    SHORT s;           "short"
    USHORT us;         "ushort"
    BYTE b;            "byte"
    UBYTE ub;          "ubyte"
    FLOAT f;           "float"
    DOUBLE d;          "double"
    BIGINT offset;     "bigint"
    STRING name;       "string"
    LSTRING desc;      "lstring"
    CHAR[1] strand;    "char"
    ENUM(a,b) kind;    "enum"
    SET(x,y) flags;    "set"
    uint id primary auto; "primary key"
    string city index[4]; "index with size"
    )`
    const result = parse(table) as { fields: { type: string; name: string }[] }
    expect(result.fields.map(f => f.type)).toMatchSnapshot()
  })

  // kent/src/hg/autoSql/tests/input/ — run all shipped test schemas through the parser
  describe('kent test corpus', () => {
    // splits a multi-declaration autoSql string into individual declaration strings
    function splitDeclarations(src: string) {
      const result: string[] = []
      let depth = 0
      let start = 0
      for (let i = 0; i < src.length; i++) {
        if (src[i] === '(') {
          depth++
        } else if (src[i] === ')') {
          depth--
          if (depth === 0) {
            result.push(src.slice(start, i + 1).trim())
            start = i + 1
          }
        }
      }
      return result.filter(s => s.trim())
    }

    // hardTest.as: Ubyte (camelCase), string[N] fixed arrays, compound types as plain fields
    test('hardTest.as', () => {
      const src = `object point
"Three dimensional point"
    (
    int x;  "x coor"
    int y;  "y coor"
    int z;  "z coor"
    )

table autoTest
"Just a test table"
    (
    uint id; "Unique ID"
    char[12] shortName; "12 character or less name"
    string longName; "full name"
    string[3] aliases; "three nick-names"
    object point threeD;  "Three dimensional coordinate"
    int ptCount;  "number of points"
    short[ptCount] pts;  "point list"
    int difCount;  "number of difs"
    Ubyte [difCount] difs; "dif list"
    int[2] xy;  "2d coordinate"
    int valCount; "value count"
    string[valCount] vals; "list of values"
    double dblVal; "double value"
    float fltVal; "float value"
    double[valCount] dblArray; "double array"
    float[valCount] fltArray; "float array"
    )`
      const decls = splitDeclarations(src)
      expect(decls).toHaveLength(2)
      for (const d of decls) {
        expect(() => parse(d)).not.toThrow()
      }
      const table = parse(decls[1]!) as {
        fields: { type: string; name: string }[]
      }
      expect(
        table.fields.map(f => ({ type: f.type, name: f.name })),
      ).toMatchSnapshot()
    })

    // simpleTest.as: deeply nested simple/object/table, bigint, variable-size arrays
    test('simpleTest.as parses all declarations', () => {
      const src = `simple point
"A two dimensional point"
    (
    int x;	"X dimension"
    int y;	"Y dimension"
    )

simple namedPoint
"A named point"
    (
    string name;	"Name of point"
    simple point point;	"X/Y coordinates"
    )

simple triangle
"A collection of three points."
    (
    string name;	"Name of triangle"
    simple point[3] points; "The three vertices"
    )

simple polygon
"A bunch of connected points."
    (
    string name;	"Name of polygon"
    int vertexCount;	"Number of vertices"
    simple point[vertexCount] vertices; "The x/y coordinates of all vertices"
    )

simple person
"Info on a person"
   (
   string firstName;	"First name"
   string lastName;	"Last name"
   bigint ssn;	"Social security number"
   )

table metaGroupLogo
"Tie together a polygonal logo with a metaGroup"
    (
    simple polygon logo;	"Logo of meta groups"
    simple metaGroup conspiracy;	"Conspiring meta groups"
    )`
      const decls = splitDeclarations(src)
      expect(decls.length).toBeGreaterThanOrEqual(5)
      for (const d of decls) {
        expect(() => parse(d)).not.toThrow()
      }
    })

    // doc2.as: simple/object/table with cross-references — matches Kent's shipped example
    test('doc2.as parses all declarations', () => {
      const src = `simple point
"A three dimensional point"
    (
    float x;  "Horizontal coordinate"
    float y;  "Vertical coordinate"
    float z;  "In/out of screen coordinate"
    )

simple color
"A red/green/blue format color"
    (
    ubyte red;  "Red value 0-255"
    ubyte green; "Green value 0-255"
    ubyte blue;  "Blue value 0-255"
    )

object face
"A face of a three dimensional solid"
    (
    simple color color;  "Color of this face"
    int pointCount;    "Number of points in this polygon"
    uint[pointCount] points;   "Indices of points that make up face in polyhedron point array"
    )

table polyhedron
"A solid three dimensional object"
    (
    int faceCount;  "Number of faces"
    object face[faceCount] faces; "List of faces"
    int pointCount; "Number of points"
    simple point[pointCount] points; "Array of points"
    )`
      const decls = splitDeclarations(src)
      expect(decls).toHaveLength(4)
      for (const d of decls) {
        expect(() => parse(d)).not.toThrow()
      }
    })
  })
})
