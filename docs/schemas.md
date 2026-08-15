# Schemas

A BED line is just columns, so something has to tell the parser what they mean.
Four ways to do it, in the order the constructor prefers them.

## A supplied autoSql

For a custom BED format, or a bigBed that carries its schema in the header:

```js
import { BigBed } from '@gmod/bbi'

const bigbed = new BigBed({ path: 'yourfile.bb' })
const { autoSql } = await bigbed.getHeader()
const p = new BED({ autoSql })
p.parseLine(line)
```

The autoSql counts as the whole layout: columns past its last field drop rather
than arriving as extras.

## A builtin type

```js
const p = new BED({ type: 'bigGenePred' })
p.parseLine(
  'chr1\t11868\t14409\tENST00000456328.2\t1000\t+\t11868\t11868\t255,128,0\t3\t359,109,1189,\t0,744,1352,\tDDX11L1\tnone\tnone\t-1,-1,-1,\tnone\tENST00000456328.2\tDDX11L1\tnone',
)
// { chrom: 'chr1', chromStart: 11868, chromEnd: 14409,
//   name: 'ENST00000456328.2', score: 1000, strand: 1,
//   thickStart: 11868, thickEnd: 11868, reserved: '255,128,0',
//   blockCount: 3, blockSizes: [359, 109, 1189],
//   chromStarts: [0, 744, 1352], name2: 'DDX11L1',
//   cdsStartStat: 'none', cdsEndStat: 'none', exonFrames: [-1, -1, -1],
//   type: 'none', geneName: 'ENST00000456328.2', geneName2: 'DDX11L1',
//   geneType: 'none' }
```

### Builtin types

| type            | source                                                                                |
| --------------- | ------------------------------------------------------------------------------------- |
| `bigInteract`   | [interact.as](https://genome.ucsc.edu/goldenpath/help/examples/interact/interact.as)  |
| `bigMaf`        | [bigMaf.as](https://genome.ucsc.edu/goldenPath/help/examples/bigMaf.as)               |
| `bigPsl`        | [bigPsl.as](https://genome.ucsc.edu/goldenPath/help/examples/bigPsl.as)               |
| `bigNarrowPeak` | [bigNarrowPeak.as](https://genome.ucsc.edu/goldenPath/help/examples/bigNarrowPeak.as) |
| `bigGenePred`   | [bigGenePred.as](https://genome.ucsc.edu/goldenPath/help/examples/bigGenePred.as)     |
| `bigLink`       | [bigLink.as](https://genome.ucsc.edu/goldenPath/help/examples/bigLink.as)             |
| `bigChain`      | [bigChain.as](https://genome.ucsc.edu/goldenPath/help/examples/bigChain.as)           |
| `mafFrames`     | kent's source tree — no goldenPath example page                                       |
| `mafSummary`    | kent's source tree — no goldenPath example page                                       |

[`src/as/autoSqlSchemas.ts`](../src/as/autoSqlSchemas.ts) inlines the
declarations, alongside `defaultBedSchema` — the standard BED12 columns the
parser falls back on. Each one parses on first use, so importing the package
doesn't pay for schemas you never ask for.

## Column names

A BED file with a header line names its columns but says nothing about their
types, so each type comes from the standard column of the same name —
`chromStart` numeric, `blockSizes` a numeric array — and anything unrecognized
stays a string.

```js
const p = new BED({
  columnNames: ['chrom', 'chromStart', 'chromEnd', 'pValue'],
})
p.parseLine('chr1\t0\t100\t1e-4')
// { chrom: 'chr1', chromStart: 0, chromEnd: 100, pValue: '1e-4', strand: 0 }
```

The parser matches those names against the standard BED and bigGenePred columns,
with BED winning where the two disagree. Like a supplied autoSql, the list is
the whole layout.

## Nothing at all

`new BED()` uses the standard BED schema, but treats a line that doesn't look
like BED12 as [partly unknown](parsing-behavior.md#without-a-schema) rather than
forcing the standard names onto it.

## The autoSql parser

`src/autoSql.ts` is a hand-written parser for the format, serving both the
builtin schemas and anything you supply. Beyond the documented grammar it
handles what real UCSC and ENCODE files contain: quoted field names, quoted and
numeric `enum`/`set` values, unclosed comment quotes, `name[size]` as well as
`type[size]`, and comments before the declaration.
[CONTRIBUTING.md](../CONTRIBUTING.md#the-autosql-parser) describes how we
validate it.

References:

- <https://genome-source.gi.ucsc.edu/gitlist/kent.git/blob/master/src/hg/autoSql/autoSql.doc>
- <http://genomewiki.ucsc.edu/index.php/AutoSql>
- <https://www.linuxjournal.com/article/5949>
