# API

## `new BED(opts?)`

| option        | type       | meaning                                                 |
| ------------- | ---------- | ------------------------------------------------------- |
| `autoSql`     | `string`   | an autoSql declaration to parse lines with              |
| `type`        | `string`   | one of the [builtin schemas](schemas.md#builtin-types)  |
| `columnNames` | `string[]` | column names, e.g. from a `#chrom start end ...` header |

At most one applies; with none, the parser falls back on the standard BED schema
and gives short lines
[the schema-less treatment](parsing-behavior.md#without-a-schema). An unknown
`type` throws `Type not found: <type>`, and a malformed `autoSql` throws with
the line and column it gave up at.

`parser.autoSql` holds the parsed schema.

## `parseLine(line, opts?)`

- `line: string | string[]` — a tab-delimited line, or the columns already
  split. Pass an array to parse the space-delimited form UCSC also allows.
- `opts.uniqueId: string` — lands on the feature as `uniqueId`, for an id the
  line itself doesn't carry.

Returns a `Feature`: a plain object keyed by schema field name.

```js
const p = new BED({ type: 'bigNarrowPeak' })
p.parseLine('chr1\t0\t100\tpeak1\t100\t+\t1.5\t2.5\t3.5\t50', {
  uniqueId: 'peak-1',
})
// { chrom: 'chr1', chromStart: 0, chromEnd: 100, name: 'peak1', score: 100,
//   strand: 1, signalValue: 1.5, pValue: 2.5, qValue: 3.5, peak: 50,
//   uniqueId: 'peak-1' }
```

Every call is independent, so one parser instance serves a whole file, and every
file that shares its schema.

## Types

```ts
import type {
  Feature,
  AutoSqlField,
  AutoSqlPreSchema,
  AutoSqlSchema,
} from '@gmod/bed'

type Feature = Record<string, string | number | string[] | number[]>
```

`AutoSqlField` is one declared field (`name`, `type`, `comment`, plus `size` for
arrays and `vals` for `enum`/`set`). `AutoSqlSchema` is the field list after
type detection, each field carrying `isNumeric`, `isArray`, and `arrayIsNumeric`
— that is the shape of `parser.autoSql`.
