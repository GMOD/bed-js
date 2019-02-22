# bed-js

[![Build Status](https://travis-ci.com/GMOD/bed-js.svg?branch=master)](https://travis-ci.com/GMOD/bed-js)
[![Coverage Status](https://img.shields.io/codecov/c/github/GMOD/bed-js/master.svg?style=flat-square)](https://codecov.io/gh/GMOD/bed-js/branch/master)

Performs parsing of BED files including autoSql

## Usage

This parser is based on parsing the BED lines only

```
var parser = new BED()
var text = fs.readFileSync('file.txt', 'utf8')
var results = text.split('\n').map(line => parser.parseLine(line))
```

The default BED parser can do BED3,4,5,6. Todo: add BED12

If you have a BED format that corresponds to some default autoSql types then you can specify this

```
const p = new BED({ type: 'bigGenePred' })
const f1 = p.parseLine(
  'chr1\t11868\t14409\tENST00000456328.2\t1000\t+\t11868\t11868\t255,128,0\t3\t359,109,1189,\t0,744,1352,\tDDX11L1\tnone\tnone\t-1,-1,-1,\tnone\tENST00000456328.2\tDDX11L1\tnone'
```

See src/defaultTypes.js for the default autoSql types. Else if you have a different default type specify your own autoSql using

```
const p = new BED({ type: /* your autosql formatted string here */ })
```

Your autosql will be validated against a grammar for autoSql and used in subsequent parseLine calls

Note that this BED parsing does not do any conversion of types beyond string vs int but helps assign keys to values


## Academic Use

This package was written with funding from the [NHGRI](http://genome.gov) as part of the [JBrowse](http://jbrowse.org) project. If you use it in an academic project that you publish, please cite the most recent JBrowse paper, which will be linked from [jbrowse.org](http://jbrowse.org).

## License

MIT © [Colin Diesh](https://github.com/cmdcolin)

