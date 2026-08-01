# Contributing

## Development

```sh
pnpm install
pnpm test        # pnpm test:watch to re-run on change
pnpm build
pnpm test:pack   # packs the tarball and imports it through both entry points
```

Use `pnpm version patch/minor/major` to release — it runs lint, tests, build,
and the pack test, then pushes the version tag which triggers the publish
workflow.

## Publishing

Releases publish automatically via GitHub Actions using npm trusted publishing
(OIDC, no stored token). The workflow requires `--provenance` and
`id-token: write` permissions.

This repo is already configured. To set up a new package:
`npm trust github <pkg> --file publish.yml --repo GMOD/<repo>` (requires
npm >=11.10.0 and 2FA).
