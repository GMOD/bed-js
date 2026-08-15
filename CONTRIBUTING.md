# Contributing

## Development

```sh
pnpm install
pnpm test        # watches; pnpm test --run for a single pass
pnpm build
pnpm test:pack   # packs the tarball and imports it through both entry points
```

Use `pnpm version patch/minor/major` to release — it runs lint, tests, build,
and the pack test, then pushes the version tag which triggers the publish
workflow.

## The autoSql parser

`src/autoSql.ts` is hand-written, and replaced a peggy grammar (`autoSql.pegjs`
plus its 1500-line generated bundle, 71% of the published package) in
August 2026. It was validated by parsing all 948 `.as` files in kent's tree with
both parsers: of the 908 holding a single declaration, 881 parsed
byte-identically, 0 regressed, and 26 that the grammar rejected now parse —
quoted or numeric enum values, a quoted field name, `name[size]`, a field list
closing on the last comment line, comments before the declaration. Each of those
has a test.

If you change the parser, that corpus is the check:
`git clone --depth 1 https://github.com/ucscGenomeBrowser/kent` and parse every
`.as` in it.

## Publishing

Releases publish automatically via GitHub Actions using npm trusted publishing
(OIDC, no stored token). The workflow requires `--provenance` and
`id-token: write` permissions.

This repo is already configured. To set up a new package:
`npm trust github <pkg> --file publish.yml --repo GMOD/<repo>` (requires
npm >=11.10.0 and 2FA).

Once npm publish succeeds, the `release` job creates the GitHub release for the
tag. Its notes are that version's CHANGELOG.md section, extracted by
`scripts/release-notes.sh` — run that with a version to preview what a release
will say.
