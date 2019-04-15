# bed-js

[![Build Status](https://travis-ci.com/GMOD/bed-js.svg?branch=master)](https://travis-ci.com/GMOD/bed-js)
[![Coverage Status](https://img.shields.io/codecov/c/github/GMOD/bed-js/master.svg?style=flat-square)](https://codecov.io/gh/GMOD/bed-js/branch/master)

Performs parsing of BED files including autoSql

## Usage


### Example

You can pipe your file through this programs parseLine function

```js
var parser = new BED()
var text = fs.readFileSync('file.txt', 'utf8')
var results = text.split('\n').map(line => parser.parseLine(line))
```

### BED parser with default schema

The default instantiation of the parser with new BED() simply parses lines assuming the fields come from the standard BED schema.

```js
const p = new BED()
const feature = p.parseLine('chr1\t0\t100')
// { chrom: 'chr1', chromStart: 0, chromEnd: 100, strand: 0 }
```

The default schema is the same 12 fields as UCSC

    chrom
    chromStart
    chromEnd
    name
    score
    strand
    thickStart
    thickEnd
    itemRgb
    blockCount
    blockSizes
    blockStarts

If only a subset of those are used, it just parses up to that, e.g. your line can just contain chrom, chromStart, chromEnd, name, score.


### BED parser with alternative schema

If you have a BED format that corresponds to a different schema, you can specify from a list of default built in alternate schemas or specify an autoSql as a string

The alternative types by default include

    bigInteract
    bigMaf
    bigPsl
    bigNarrowPeak
    bigGenePred
    bigLink
    bigChain
    mafFrames
    mafSummary

Specify this in the type for the BED constructor

```js
const p = new BED({ type: 'bigGenePred' })
const line = 'chr1\t11868\t14409\tENST00000456328.2\t1000\t+\t11868\t11868\t255,128,0\t3\t359,109,1189,\t0,744,1352,\tDDX11L1\tnone\tnone\t-1,-1,-1,\tnone\tENST00000456328.2\tDDX11L1\tnone'
p.parseLine(line)
// above line outputs
      { chrom: 'chr1',
        chromStart: 11868,
        chromEnd: 14409,
        name: 'ENST00000456328.2',
        score: 1000,
        strand: 1,
        thickStart: 11868,
        thickEnd: 11868,
        reserved: '255,128,0',
        blockCount: 3,
        blockSizes: [ 359, 109, 1189 ],
        chromStarts: [ 0, 744, 1352 ],
        name2: 'DDX11L1',
        cdsStartStat: 'none',
        cdsEndStat: 'none',
        exonFrames: [ -1, -1, -1 ],
        type: 'none',
        geneName: 'ENST00000456328.2',
        geneName2: 'DDX11L1',
        geneType: 'none' }
```

### BED parser with autoSql

If you have a BED format with a custom alternative schema with autoSql, or if you are using a BigBed file that contains autoSql (e.g. with [@gmod/bbi](https://github.com/gmod/bbi-js) then you can get it from header.autoSql)


```
const p = new BED({ autoSql: /* your autosql formatted string here */ })
```


### Important notes


* Does not do any conversion of types beyond just converting known int/float values
* Does not convert blockStarts/blockEnds to gene features
* Does not parse header or track lines
* Does not handle files that use spaces instead of tabs even though this is allowed by UCSC


## Academic Use

This package was written with funding from the [NHGRI](http://genome.gov) as part of the [JBrowse](http://jbrowse.org) project. If you use it in an academic project that you publish, please cite the most recent JBrowse paper, which will be linked from [jbrowse.org](http://jbrowse.org).

## License

MIT © [Colin Diesh](https://github.com/cmdcolin)

