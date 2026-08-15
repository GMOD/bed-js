# Parsing behavior

## Lines

The parser treats every line as a feature. It does not recognize `track`,
`browser`, `#` comment or blank lines, and turns them into junk features with
`NaN` coordinates rather than erroring, so filter them out before calling
`parseLine`.

Only tabs split a line. UCSC also allows spaces; to parse that form, split it
yourself and pass the array.

## Values

- **strand** converts from `{+,-,.}` to `{1,-1,0}`, and lands at `0` even when
  the schema has no strand field.
- **`.` or an empty column means missing data**: the parser leaves the field
  unset rather than storing the string `.` or the number `0`.
- **A numeric field that doesn't hold a number keeps its string**, so a
  malformed column doesn't silently become `NaN`.
- **Arrays** (`int[blockCount]`, `char[2]`) split on commas, dropping the
  trailing empty one UCSC writes. `char[n]` stays a string.
- **`chrom` is percent-decoded**, since bigBed writers escape names — but only
  well-formed `%XX` escapes, so a contig genuinely named `chr%_test` survives.

## Without a schema

`new BED()` names columns from the standard BED schema, but only commits to
those names for a line that looks like BED12 — twelve or more columns, where
column 10 is a count matching the number of block sizes in column 11. Anything
shorter is a BED of unknown width, where column 7 is as likely to be some
annotation as `thickStart`, so the parser only claims what it can tell:

```js
new BED().parseLine('chr1\t0\t100\tfoo\t50\t+\textra1\textra2')
// { chrom: 'chr1', chromStart: 0, chromEnd: 100, name: 'foo',
//   score: 50, strand: 1, field6: 'extra1', field7: 'extra2' }
```

Columns 1-4 are `chrom`, `chromStart`, `chromEnd`, `name`. Column 5 is `score`
if it parses as a number, column 6 is `strand` if it is `+` or `-`, and
everything else keeps its column number as `fieldN` (zero-based, so column 7 is
`field6`). On this path `.` stays a literal value rather than counting as
missing.

Give the parser an `autoSql`, `type`, or `columnNames` and the guessing stops
entirely — it trusts the schema for lines of any length.

## Extra columns

With the default schema, columns past the twelfth of a BED12+n line arrive as
`field12`, `field13`, and so on. A supplied autoSql or `columnNames` counts as
the complete layout, so anything past its end drops.
