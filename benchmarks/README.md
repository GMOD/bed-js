# BED benchmarks

To compare your HEAD against `origin/main`:

```bash
pnpm bench
```

To compare specific refs:

```bash
BRANCH1=origin/main BRANCH2=my-feature-branch pnpm bench
```

`scripts/build-both-branches.sh` builds each ref in a throwaway git worktree
into `esm_branch1/` and `esm_branch2/`, and `parse.bench.ts` runs both over the
same lines. It throws before timing anything if the two builds parse a line
differently. Build a ref against itself to see how much the numbers drift
between identical builds.

`pnpm benchonly` skips the build and compares whatever was built last.

## The data

2,000 lines of each, gzipped, chosen for the parse path each one takes:

| file                            | source                                  | path                     |
| ------------------------------- | --------------------------------------- | ------------------------ |
| `hs1-repeatmasker.bed.gz`       | UCSC hs1 RepeatMasker                   | header names, arrays     |
| `hprc-genes-bed12.bed.gz`       | HPRC HG00133.1 genes                    | BED12, numeric arrays    |
| `giant-bmi-gwas.bed.gz`         | GIANT BMI women-only summary statistics | header names, scalars    |
| `encode-subcompartments.bed.gz` | ENCODE ENCFF247IAA subcompartments      | guessed columns          |
| `colo829-modkit.bed.gz`         | COLO829 modkit bedMethyl                | guessed columns, 18 wide |
