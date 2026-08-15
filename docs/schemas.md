# Schemas

A BED line is just columns, so the parser needs to be told what they mean. Four
ways, in the order the constructor prefers them.

## A supplied autoSql

For a custom BED format, or a bigBed that carries its schema in the header:

```js
import { BigBed } from '@gmod/bbi'

const bigbed = new BigBed({ path: 'yourfile.bb' })
const { autoSql } = await bigbed.getHeader()
const p = new BED({ autoSql })
p.parseLine(line)
```

The autoSql is taken as the whole layout: columns past its last field are
dropped rather than kept as extras.

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

The declarations are inlined in
[`src/as/autoSqlSchemas.ts`](../src/as/autoSqlSchemas.ts), alongside
`defaultBedSchema` — the standard BED12 columns used when nothing is specified.
Each is parsed on first use, so importing the package doesn't pay for schemas
you never ask for.

## Column names

A BED file with a header line names its columns but says nothing about their
types, so types come from the standard column of the same name — `chromStart`
numeric, `blockSizes` a numeric array — and anything unrecognized is a string.

```js
const p = new BED({
  columnNames: ['chrom', 'chromStart', 'chromEnd', 'pValue'],
})
p.parseLine('chr1\t0\t100\t1e-4')
// { chrom: 'chr1', chromStart: 0, chromEnd: 100, pValue: '1e-4', strand: 0 }
```

Names are matched against the standard BED and bigGenePred columns, with BED
winning where the two disagree. Like a supplied autoSql, the list is the whole
layout.

## Nothing at all

`new BED()` uses the standard BED schema, but treats a line that doesn't look
like BED12 as [partly unknown](parsing-behavior.md#without-a-schema) rather than
forcing the standard names onto it.

## The autoSql parser

`src/autoSql.ts` is a hand-written parser for the format, used for both the
builtin schemas and anything supplied. Beyond the documented grammar it handles
what real UCSC and ENCODE files contain: quoted field names, quoted and numeric
`enum`/`set` values, unclosed comment quotes, `name[size]` as well as
`type[size]`, and comments before the declaration. See
[CONTRIBUTING.md](../CONTRIBUTING.md#the-autosql-parser) for how it's validated.

References:

- <https://genome-source.gi.ucsc.edu/gitlist/kent.git/blob/master/src/hg/autoSql/autoSql.doc>
- <http://genomewiki.ucsc.edu/index.php/AutoSql>
- <https://www.linuxjournal.com/article/5949>
