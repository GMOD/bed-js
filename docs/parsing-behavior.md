# Parsing behavior

## Lines

The parser treats every line as a feature, including `track`, `browser`, `#`
comment and blank lines. It turns those lines into junk features with `NaN`
coordinates and throws no error, so filter them out before calling `parseLine`.

The parser splits a line only on tabs, although UCSC also allows spaces. To
parse that form, split the line yourself and pass the array.

## Values

- **strand**: the parser converts `{+,-,.}` to `{1,-1,0}` and a numeric strand
  to its sign, and sets `0` even when the schema has no strand field.
- **`.`**: the parser leaves the field unset.
- **An empty or whitespace-only numeric column**: the parser leaves the field
  unset, so a missing value never reads as `0`. An empty string column stays
  `''`.
- **A numeric field that doesn't hold a number**, or a `bigint` past
  `Number.MAX_SAFE_INTEGER`: the parser stores the string as written.
- **Arrays** (`int[blockCount]`, `char[2]`) split on commas, dropping the
  trailing empty one UCSC writes. `char[n]` stays a string.
- **`chrom`**: the parser percent-decodes it, since bigBed writers escape names.
  It decodes only well-formed `%XX` escapes, so a contig named `chr%_test` keeps
  its name.

## Without a schema

`new BED()` names columns from the standard BED schema, and applies every name
only to a line that looks like BED12: twelve or more columns, where column 10 is
a count matching the number of block sizes in column 11. Any other line is a BED
of unknown width, where column 7 is as likely to be some annotation as
`thickStart`, so the parser names only the columns it can be sure of:

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

With an `autoSql`, `type` or `columnNames`, the parser skips this guessing and
applies the schema to lines of any length.

## Extra columns

With the default schema, the parser names the columns past the twelfth of a
BED12+n line `field12`, `field13`, and so on. A supplied autoSql or
`columnNames` counts as the complete layout, so anything past its end drops.
