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

## [2.1.8](https://github.com/GMOD/bed-js/compare/v2.1.7...v2.1.8) (2026-01-19)

## [2.1.7](https://github.com/GMOD/bed-js/compare/v2.1.5...v2.1.7) (2025-05-13)

## [2.1.6](https://github.com/GMOD/bed-js/compare/v2.1.5...v2.1.6) (2025-05-13)

## [2.1.5](https://github.com/GMOD/bed-js/compare/v2.1.4...v2.1.5) (2025-05-13)

## [2.1.4](https://github.com/GMOD/bed-js/compare/v2.1.3...v2.1.4) (2025-05-13)

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
