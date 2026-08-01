#!/usr/bin/env bash
# Smoke-test the published artifact shape by packing and importing.
#
# `pnpm test` runs against src/, so it can't see package.json's entry-point
# map at all. A missing "main"/"types" (which breaks consumers on TypeScript's
# node10 moduleResolution, since that mode ignores "exports" entirely) or an
# "exports" target that never made it into the tarball both ship green and
# only fail once installed downstream. This script:
#   1. `npm pack`s the package
#   2. installs the tarball into a scratch dir
#   3. asserts every advertised entry point exists in the tarball
#   4. imports `@gmod/bed` through both the ESM and CJS entry points and
#      parses lines with a builtin schema and a supplied autoSql

set -euo pipefail

PKG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRATCH="$(mktemp -d)"
trap 'rm -rf "$SCRATCH"' EXIT

cd "$PKG_DIR"
TARBALL="$(npm pack --silent --pack-destination "$SCRATCH")"

cd "$SCRATCH"
cat >package.json <<'JSON'
{
  "name": "bed-pack-test",
  "version": "0.0.0",
  "private": true,
  "type": "module"
}
JSON
npm install --silent --no-audit --no-fund "./$TARBALL" >/dev/null

cat >entrypoints.mjs <<'JS'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = 'node_modules/@gmod/bed'
const pkg = JSON.parse(readFileSync(`${root}/package.json`, 'utf8'))
const entries = {
  main: pkg.main,
  types: pkg.types,
  'exports.import': pkg.exports?.import,
  'exports.require': pkg.exports?.require,
}
for (const [field, value] of Object.entries(entries)) {
  if (!value) {
    throw new Error(`package.json has no "${field}"`)
  }
  if (!existsSync(resolve(root, value))) {
    throw new Error(`"${field}" points at ${value}, missing from the tarball`)
  }
}
// node16/bundler resolution finds ESM types by adjacency rather than a
// "types" condition, so the .d.ts next to the ESM entry has to be there too
const esmTypes = pkg.exports.import.replace(/\.js$/, '.d.ts')
if (!existsSync(resolve(root, esmTypes))) {
  throw new Error(`no ${esmTypes} next to the ESM entry`)
}
console.log('entry points ok')
JS

cat >smoke.mjs <<'JS'
import BED from '@gmod/bed'
import { check } from './check.mjs'
check(BED, 'esm')
JS

cat >smoke.cjs <<'JS'
const BED = require('@gmod/bed').default
import('./check.mjs').then(({ check }) => {
  check(BED, 'cjs')
})
JS

cat >check.mjs <<'JS'
const autoSql = `table pack
"supplied at runtime, exercises the peggy parser in the bundle"
(
string chrom;      "Chromosome"
uint   chromStart; "Start"
uint   chromEnd;   "End"
char[1] strand;    "+ or -"
)`

function assertEqual(actual, expected, what) {
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) {
    throw new Error(`${what}: got ${a}, wanted ${b}`)
  }
}

export function check(BED, label) {
  if (typeof BED !== 'function') {
    throw new Error(`${label}: default export is not the BED class`)
  }
  assertEqual(
    new BED().parseLine('chr1\t10\t100\tfoo\t5\t-'),
    { chrom: 'chr1', chromStart: 10, chromEnd: 100, name: 'foo', score: 5, strand: -1 },
    `${label} default schema`,
  )
  assertEqual(
    new BED({ type: 'bigLink' }).parseLine('chr1\t10\t100\tfoo\t5'),
    { chrom: 'chr1', chromStart: 10, chromEnd: 100, name: 'foo', qStart: 5, strand: 0 },
    `${label} builtin schema`,
  )
  assertEqual(
    new BED({ autoSql }).parseLine('chr1\t10\t100\t+'),
    { chrom: 'chr1', chromStart: 10, chromEnd: 100, strand: 1 },
    `${label} supplied autoSql`,
  )
  console.log(`${label}: ok`)
}
JS

node entrypoints.mjs
node smoke.mjs
node smoke.cjs
