# [2.0.0](https://github.com/GMOD/bed-js/compare/v1.0.4...v2.0.0) (2019-04-15)



### Major changes

- API now processes just text lines with the parseLine method
- Remove snake case of results
- Returned values match autoSql very faithfully and uses the naming from UCSC e.g. exact strings from autoSql {chrom, chromStart, chromEnd}
- Accepts a opts.uniqueId for the parseLine method which adds this to the featureData
- Parses the default BED schema with a defaultBedSchema.as autoSql definition instead of a separate method


## [1.0.4](https://github.com/GMOD/bed-js/compare/v1.0.3...v1.0.4) (2019-04-14)



- Changed parseBedText to accept an Options argument with offset and optionally a uniqueId

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




