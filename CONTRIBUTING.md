# Contributing

## Development

```sh
pnpm install
pnpm test        # watches; pnpm test --run for a single pass
pnpm build
pnpm test:pack   # packs the tarball and imports it through both entry points
```

Use `pnpm version patch/minor/major` to release. It runs lint, format, types,
tests, build and `test:pack`, regenerates CHANGELOG.md with git-cliff, then
pushes the version tag, which triggers the publish workflow.

[docs/api.md](docs/api.md) is written by hand, and `test/apiDocs.test.ts` fails
when a public member of `BED`, `AutoSqlField`, `AutoSqlPreSchema`, or an export,
is missing from it. Document the new member, or add it to the test's
`undocumented` list with the reason it is internal.

## The autoSql parser

`src/autoSql.ts` is a hand-written parser that replaced a peggy grammar
(`autoSql.pegjs` plus its 1500-line generated bundle, 71% of the published
package) in August 2026. We checked it by parsing all 948 `.as` files in kent's
tree with both parsers. Of the 908 files that contain a single declaration, 881
parsed byte-identically and none regressed. Another 26, which the grammar
rejected, now parse; they use quoted or numeric enum values, a quoted field
name, `name[size]`, a field list that closes on the last comment line, or
comments before the declaration. Each of those cases has a test.

To check a change to the parser against the same corpus, run
`git clone --depth 1 https://github.com/ucscGenomeBrowser/kent` and parse every
`.as` in it.

## Publishing

Releases publish automatically via GitHub Actions using npm trusted publishing
(OIDC, no stored token). The workflow requires `--provenance` and
`id-token: write` permissions.

bed-js already has trusted publishing set up. To set up a new package:
`npm trust github <pkg> --file publish.yml --repo GMOD/<repo>` (requires
npm >=11.10.0 and 2FA).

Once npm publish succeeds, the `release` job creates the GitHub release for the
tag. `scripts/release-notes.sh` copies the release notes from that version's
CHANGELOG.md section; run it with a version to preview what a release will say.
