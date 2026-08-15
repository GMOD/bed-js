# bed-js

[![Coverage Status](https://img.shields.io/codecov/c/github/GMOD/bed-js/main.svg?style=flat-square)](https://codecov.io/gh/GMOD/bed-js/branch/main)
![Build Status](https://img.shields.io/github/actions/workflow/status/GMOD/bed-js/publish.yml?branch=main)

Parses BED lines into feature objects, using the file's autoSql schema when it
has one. Includes a standalone autoSql parser and the UCSC bigBed schemas.

## Install

```sh
npm install @gmod/bed
```

## Usage

Feed the parser one line at a time:

```js
import BED from '@gmod/bed'

const parser = new BED()
const features = text
  .split('\n')
  .filter(line => line.trim() && !/^(#|track|browser)/.test(line))
  .map(line => parser.parseLine(line))

parser.parseLine('chr1\t0\t100\tgene1\t50\t+')
// { chrom: 'chr1', chromStart: 0, chromEnd: 100, name: 'gene1',
//   score: 50, strand: 1 }
```

`parseLine` has no notion of header or comment lines — filter them out first, or
they come back as features with `NaN` coordinates.

A file whose first line names its columns can hand that line straight back as
`columnNames`, instead of dropping it with the other `#` lines:

```js
const [header, ...rest] = text.split('\n')
const parser = new BED({ columnNames: header.replace(/^#/, '').split('\t') })
rest.map(line => parser.parseLine(line))
```

## Schemas

The constructor decides how columns are named and typed, four ways:

```js
new BED() // standard BED columns
new BED({ autoSql }) // an autoSql string, e.g. from a bigBed header
new BED({ type: 'bigGenePred' }) // a builtin UCSC schema
new BED({ columnNames }) // names from a '#chrom start end ...' header
```

## Documentation

- [API](docs/api.md) — constructor, `parseLine`, exported types
- [Schemas](docs/schemas.md) — the builtin list, autoSql, column-name headers
- [Parsing behavior](docs/parsing-behavior.md) — strand, missing data, BED12+n,
  and what gets guessed when there is no schema
- [Contributing](CONTRIBUTING.md) — development and releases

## Academic Use

This package was written with funding from the [NHGRI](http://genome.gov) as
part of the [JBrowse](http://jbrowse.org) project. If you use it in an academic
project that you publish, please cite the most recent JBrowse paper, which will
be linked from [jbrowse.org](http://jbrowse.org).

## License

MIT © [Colin Diesh](https://github.com/cmdcolin)
