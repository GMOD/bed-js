## [2.3.0](https://github.com/GMOD/bed-js/compare/v2.2.10...v2.3.0) (2026-08-15)

### Bug Fixes

- Stop shipping every schema again as a string literal type ([605954e](https://github.com/GMOD/bed-js/commit/605954e1e09be492d8eef1a8b126401d4a3352e5))
- Keep the data in a BED12+n line, an empty column, and a bigint column ([ca1f02b](https://github.com/GMOD/bed-js/commit/ca1f02ba4bfa882cacb07ce8650320df42149f33))

### Chores

- Render only the commit subject, and link the commit ([08b893c](https://github.com/GMOD/bed-js/commit/08b893c8c41a160e4a5901557e60e1c9c074156c))
- Create a GitHub release for each published tag ([81c96a4](https://github.com/GMOD/bed-js/commit/81c96a451a9a51446df8f90993d37b7ac9c0dd65))
- Enforce type strippability in tsconfig ([eb40c2a](https://github.com/GMOD/bed-js/commit/eb40c2a72a61cae4270c7b1756fa493061335be3))
- Keep agent worktrees out of the toolchain's way ([c559a73](https://github.com/GMOD/bed-js/commit/c559a7308f3666d68f8e3cad32d374cf0683e0dc))

### Features

- Parse a headered BED from its column names ([0129f0d](https://github.com/GMOD/bed-js/commit/0129f0dbf949bd01ebcb5d518ebce124eff7f4c7))

### Refactoring

- Hand-write the autoSql parser, dropping peggy ([5bb5154](https://github.com/GMOD/bed-js/commit/5bb5154ae1a087b4d0f15e0d32ebeb289b2703fe))

## [2.2.10](https://github.com/GMOD/bed-js/compare/v2.2.9...v2.2.10) (2026-08-10)

### Chores

- Type-check the tests and enforce prettier, as @gmod/bam does
- Let npm publish stop auto-correcting repository.url
- Exempt our own packages from the release quarantine
- Bump pnpm/action-setup to v6.0.10
- Run the test suite as `pnpm test --run`
- Drop test:watch, now a duplicate of test
- Gate preversion on format:check, as CI does
- Gate preversion on typecheck too, as CI does
- Converge package.json on the shape its siblings use

### Documentation

- Mark breaking changes in the generated changelog

### Other Changes

- Revert "chore: converge package.json" — the CHANGELOG prettier step ([9766650](https://github.com/GMOD/bed-js/commit/976665011eeb8759dd58ced52b56b7ff55a620c9))

## [2.2.9](https://github.com/GMOD/bed-js/compare/v2.2.8...v2.2.9) (2026-08-01)

### Chores

- Drop redundant types field, main alone is enough

## [2.2.8](https://github.com/GMOD/bed-js/compare/v2.2.7...v2.2.8) (2026-08-01)

### Bug Fixes

- Don't fabricate a chrom field for schemas without a chrom column
- Add main/types so node10 moduleResolution can find the package

### Chores

- Replace standard-changelog with git-cliff for changelog generation

### Documentation

- Backfill CHANGELOG.md for v2.1.10 through v2.2.7

## [2.2.7](https://github.com/GMOD/bed-js/compare/v2.2.6...v2.2.7) (2026-07-25)


### Chores

* pin pnpm via `packageManager`, declare `sideEffects: false` ([733c635](https://github.com/GMOD/bed-js/commit/733c635a61dcee807e005d305aa2b7776ae010a6))
* sha-pin CI actions, take pnpm version from `packageManager`, move test jobs to node 24 ([99181f0](https://github.com/GMOD/bed-js/commit/99181f028bad18f33e9ac8ba41deffccf7c56944))
* set pnpm `minimumReleaseAge` to 3 days ([6690c8e](https://github.com/GMOD/bed-js/commit/6690c8e5c35e3939e22296e42ceb3ac9bdcb361e))
* ban TS parameter properties, since they aren't type-strippable ([ca51208](https://github.com/GMOD/bed-js/commit/ca51208fc5e50a54f3b7d4748ff96714656a1166))

## [2.2.6](https://github.com/GMOD/bed-js/compare/v2.2.5...v2.2.6) (2026-06-19)


### Bug Fixes

* remove stale workflow query link from CI badge ([e5b8555](https://github.com/GMOD/bed-js/commit/e5b855514093f27a4d5feceff76bdffb23a0a854))
* robustify autoSql comment parsing and chrom decoding ([22edc93](https://github.com/GMOD/bed-js/commit/22edc9308fef5c1f3b9e1a384d38dcf5c22c3861))
* update CI badge to reference publish.yml workflow ([7496aa8](https://github.com/GMOD/bed-js/commit/7496aa81211aa8c938a3dc38b12b19e83350b6f0))

### Chores

* bump deps ([0b1fe91](https://github.com/GMOD/bed-js/commit/0b1fe911ca6e900b984c7b41c07f527027419f05))

## [2.2.5](https://github.com/GMOD/bed-js/compare/v2.2.4...v2.2.5) (2026-05-19)

### CI

* rename merged workflow back to publish.yml, since npm trusted publishing pins to the workflow file path via the OIDC `job_workflow_ref` claim and the merge in 2.2.4 deleted the old publish.yml ([3343793](https://github.com/GMOD/bed-js/commit/3343793f5c23563703ccdbb4d695dfdf8c23ec26))

## [2.2.4](https://github.com/GMOD/bed-js/compare/v2.2.3...v2.2.4) (2026-05-19)

### CI

* merge publish into the push workflow, gating the publish job on `needs: test` plus a tag-ref guard so a tag can't ship without tests passing in the same run ([384f83a](https://github.com/GMOD/bed-js/commit/384f83a97d8945d771ff9b1cf2d09c211c5fa2a6))

## [2.2.3](https://github.com/GMOD/bed-js/compare/v2.2.2...v2.2.3) (2026-05-18)

### Chores

* add pnpm workspace file ([a0ef7fd](https://github.com/GMOD/bed-js/commit/a0ef7fd3d316882230c3c8607ea5037de0e0b104))
* simplify package.json: drop the `main` field (superseded by `exports`) and redundant `@typescript-eslint/*` deps ([4b01290](https://github.com/GMOD/bed-js/commit/4b01290e795011f38248ed2ebeb87132e7141ed1))
* minor parser cleanups: extract `blockCount` in `isBed12Like` to avoid a double `parseInt`, drop a redundant `!!`, rename `number_` to `num`, nest the field4/score `isNaN` check ([81373d3](https://github.com/GMOD/bed-js/commit/81373d39df3b228cca7fa0882574a8ac1e5b9863))

## [2.2.2](https://github.com/GMOD/bed-js/compare/v2.2.1...v2.2.2) (2026-05-18)

### Chores

* refactor parser and util for clarity: rename constructor param `arguments_` to `opts`, replace a loop/overwrite/delete pattern in the minimal-BED path with direct field assignment, drop a redundant `!!` in a util.ts filter ([5d80b7a](https://github.com/GMOD/bed-js/commit/5d80b7ace771888cc3e2fa53bcd85de89d92a68c))
* fix README: branch badge, typo, `var` to `const`, dead link ([81c0d3b](https://github.com/GMOD/bed-js/commit/81c0d3b9c989cc153718d6ba35063a8ad11d11ec))
* update README: switch the publishing example from `npm version` to `pnpm version`, point remaining master-branch codecov badges at main ([ab398dc](https://github.com/GMOD/bed-js/commit/ab398dcc4828304d5ece0592128045ee9384aef0))

## [2.2.1](https://github.com/GMOD/bed-js/compare/v2.2.0...v2.2.1) (2026-04-28)

### Chores

* enable `allowJs` in tsconfig so the generated autoSql parser is picked up by tsc directly ([d94f260](https://github.com/GMOD/bed-js/commit/d94f2603c3a37677823f4698aa3d942833eb82a7))

# [2.2.0](https://github.com/GMOD/bed-js/compare/v2.1.10...v2.2.0) (2026-04-28)

### Features

* switch the autoSql grammar from pegjs to peggy and make declared types (`int`, `string`, etc.) and the `simple`/`object`/`table` declaration keyword case-insensitive ([9738cdd](https://github.com/GMOD/bed-js/commit/9738cddfb1c2152e5a0971e88c4240840dccd23e))

### Bug Fixes

* require a word boundary after `primary`/`index`/`unique`/`auto` field modifiers so they don't false-match inside longer identifiers, and support multiple modifiers per field ([9738cdd](https://github.com/GMOD/bed-js/commit/9738cddfb1c2152e5a0971e88c4240840dccd23e))
* trim `nonQuotedString` comments before stripping surrounding quotes ([9738cdd](https://github.com/GMOD/bed-js/commit/9738cddfb1c2152e5a0971e88c4240840dccd23e))
* coerce `isArray`/`arrayIsNumeric` in `detectTypes` to real booleans instead of a possibly-`0` size ([71e2dad](https://github.com/GMOD/bed-js/commit/71e2dadd7ac7db26ae89357c7987879089174c28))

### Chores

* add a LICENSE file ([6c4efa2](https://github.com/GMOD/bed-js/commit/6c4efa23e67619db89192a6f1a20f3db2985ed23))
* simplify `parseLine`'s `attemptDefaultBed` condition, switch `feature.strand`'s fallback from `||` to `??`, and update CI workflow versions ([71e2dad](https://github.com/GMOD/bed-js/commit/71e2dadd7ac7db26ae89357c7987879089174c28))

## [2.1.10](https://github.com/GMOD/bed-js/compare/v2.1.9...v2.1.10) (2026-01-19)

### Chores

* switch to ESM: export the generated autoSql parser with `export`/`export default` instead of `module.exports`, build `esm/` with `--module nodenext` ([0a47dde](https://github.com/GMOD/bed-js/commit/0a47ddea6dbf7f91acde9f01dbb8ede78e3166f5))

## [2.1.9](https://github.com/GMOD/bed-js/compare/v2.1.8...v2.1.9) (2026-01-19)

### Chores

* add `allowJs` to `tsconfig.json` so the compiled autoSql parser `.js` is picked up by `tsc` (type-checked and emitted to `dist`/`esm`) instead of being invisible to the build ([b3c181a](https://github.com/GMOD/bed-js/commit/b3c181ad6a43d26c87f4a8e5305f3db46b276c32))

## [2.1.8](https://github.com/GMOD/bed-js/compare/v2.1.7...v2.1.8) (2026-01-19)

### Chores

* revert to generating `src/autoSql.js` from the pegjs grammar instead of hand-writing it, and add `eslint-plugin-import` with an import-order rule, reordering imports across the codebase to match ([a108c36](https://github.com/GMOD/bed-js/commit/a108c361069428d5fc9d84204f2bd5160056d20e), [f9568c4](https://github.com/GMOD/bed-js/commit/f9568c4ba2c00ac72f650dca2cda1d270a074083), [3948f96](https://github.com/GMOD/bed-js/commit/3948f963e8f1a21a0e3436331dfd3dd415ab6900))

### Refactoring

* switch `package.json` to pure ESM (`"type": "module"`, a conditional `exports` map for `import`/`require`), dropping the old `main`/`module` fields ([2f49685](https://github.com/GMOD/bed-js/commit/2f4968542497dc00c0e542bd074fa084b3601560))

## [2.1.7](https://github.com/GMOD/bed-js/compare/v2.1.5...v2.1.7) (2025-05-13)

### Refactoring

* hand-write `src/autoSql.ts`, replacing the pegjs-generated `src/autoSql.js` ([e8fbd43](https://github.com/GMOD/bed-js/commit/e8fbd43a523653e972e70cb645ae3e072ccf7354))

## [2.1.6](https://github.com/GMOD/bed-js/compare/v2.1.5...v2.1.6) (2025-05-13)

No corresponding commits exist in git history for this tag — it was likely superseded immediately by v2.1.7, which covers the same commit range.

## [2.1.5](https://github.com/GMOD/bed-js/compare/v2.1.4...v2.1.5) (2025-05-13)

### Refactoring

* import siblings by their real `.ts`/`.js` extension, and enable `allowImportingTsExtensions`/`rewriteRelativeImportExtensions` in `tsconfig.json` so the source is type-strippable ([f30142a](https://github.com/GMOD/bed-js/commit/f30142adccef100339f54bd1be8121c1158b6ab5))

## [2.1.4](https://github.com/GMOD/bed-js/compare/v2.1.3...v2.1.4) (2025-05-13)

### Chores

* write `dist/package.json` declaring `{"type": "commonjs"}` in a new `postbuild:es5` step, so the CJS build isn't misparsed as ESM ([a88175b](https://github.com/GMOD/bed-js/commit/a88175bcfebcb0da7e342091402fbf308a59b26a))
* add test coverage reporting, and bump devDependencies ([a063057](https://github.com/GMOD/bed-js/commit/a063057f6c25d0d2ffc3a03b3f04578914fbb435), [d20c164](https://github.com/GMOD/bed-js/commit/d20c1646a9a5b7ee998181940b9b753d4fd8c49a), [1687bfe](https://github.com/GMOD/bed-js/commit/1687bfe136ca97828a052df5c6f46c3366bb8087))
* migrate the test runner from Jest to Vitest, and the ESLint config to flat config ([75ff153](https://github.com/GMOD/bed-js/commit/75ff153a5ec4b5c426c5eeed1c368dfb72f9f815), [866f509](https://github.com/GMOD/bed-js/commit/866f5093a5aa7a8a220380cb8483e52de0d528ed))
* update CI workflow settings ([101dbc0](https://github.com/GMOD/bed-js/commit/101dbc02fba16fb07100442c5575fd7f47b034a2))

## [2.1.3](https://github.com/GMOD/bed-js/compare/v2.1.2...v2.1.3) (2024-3-25)

- Fix autoSql with comments in column names

## [2.1.2](https://github.com/GMOD/bed-js/compare/v2.1.1...v2.1.2) (2022-07-24)

- Add comment string to autoSql types

## [2.1.1](https://github.com/GMOD/bed-js/compare/v2.1.0...v2.1.1) (2022-07-24)

- Make autoSql a public class field

# [2.1.0](https://github.com/GMOD/bed-js/compare/v2.0.8...v2.1.0) (2022-07-24)

- Typescriptify module and bump some devdeps

## [2.0.8](https://github.com/GMOD/bed-js/compare/v2.0.7...v2.0.8) (2022-03-30)

- Publish src directory for better source maps

## [2.0.7](https://github.com/GMOD/bed-js/compare/v2.0.6...v2.0.7) (2022-03-07)

- Add esm module export to package.json

## [2.0.6](https://github.com/GMOD/bed-js/compare/v2.0.5...v2.0.6) (2021-08-21)

- Simplify build pipeline

## [2.0.5](https://github.com/GMOD/bed-js/compare/v2.0.4...v2.0.5) (2020-12-23)

- Allow comments inside of the autosql table, seen in some clinvar bb

## [2.0.4](https://github.com/GMOD/bed-js/compare/v2.0.3...v2.0.4) (2020-12-03)

- Allow for badly formatted comments not entirely within a quote, was exhibited
  by https://hgdownload.soe.ucsc.edu/gbdb/hg19/gnomAD/pLI/pliByGene.bb

## [2.0.3](https://github.com/GMOD/bed-js/compare/v2.0.2...v2.0.3) (2020-07-09)

- Use pre-generated pegjs parser for smaller bundle size

<a name="2.0.2"></a>

## [2.0.2](https://github.com/GMOD/bed-js/compare/v2.0.1...v2.0.2) (2019-11-12)

- Small autoSql grammar improvements e.g. allow \_ in autoSql names (for
  `_mouseover` from ucsc)

<a name="2.0.1"></a>

## [2.0.1](https://github.com/GMOD/bed-js/compare/v2.0.0...v2.0.1) (2019-11-03)

- Add fix for names that contain underscores

# [2.0.0](https://github.com/GMOD/bed-js/compare/v1.0.4...v2.0.0) (2019-04-15)

### Major changes

- API now processes just text lines with the parseLine method
- Remove snake case of results
- Returned values match autoSql very faithfully and uses the naming from UCSC
  e.g. exact strings from autoSql {chrom, chromStart, chromEnd}
- Accepts a opts.uniqueId for the parseLine method which adds this to the
  featureData
- Parses the default BED schema with a defaultBedSchema.as autoSql definition
  instead of a separate method

## [1.0.4](https://github.com/GMOD/bed-js/compare/v1.0.3...v1.0.4) (2019-04-14)

- Changed parseBedText to accept an Options argument with offset and optionally
  a uniqueId

## [1.0.3](https://github.com/GMOD/bed-js/compare/v1.0.2...v1.0.3) (2019-04-02)

- Fix usage of autoSql
- Use commonjs2 target of the webpack library build

## [1.0.2](https://github.com/GMOD/bed-js/compare/v1.0.1...v1.0.2) (2019-04-02)

- Fixed dist package on npm

## [1.0.1](https://github.com/GMOD/bed-js/compare/v1.0.0...v1.0.1) (2019-04-02)

- Added BED12 support
- Improved documentation
- Fixed babel loader for webpack

# 1.0.0 (2019-02-22)

- Initial version with autoSql, BED support
- Default autoSql types compiled into module with webpack
