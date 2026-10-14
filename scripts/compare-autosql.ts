import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { parse } from '../src/autoSql.ts'

const [kentDir, baseRef = 'origin/main'] = process.argv.slice(2)
if (!kentDir) {
  console.error('usage: node scripts/compare-autosql.ts <kent-dir> [base-ref]')
  process.exit(2)
}

const baseDir = mkdtempSync(path.join(tmpdir(), 'autosql-'))
const baseFile = path.join(baseDir, 'autoSql.ts')
writeFileSync(
  baseFile,
  execFileSync('git', ['show', `${baseRef}:src/autoSql.ts`]),
)
const base = (await import(pathToFileURL(baseFile).href)) as {
  parse: typeof parse
}
rmSync(baseDir, { recursive: true })

function outcome(parser: typeof parse, source: string) {
  try {
    return JSON.stringify(parser(source))
  } catch (e) {
    return `error: ${(e as Error).message}`
  }
}

const files = readdirSync(kentDir, { recursive: true, encoding: 'utf8' })
  .filter(file => file.endsWith('.as'))
  .sort()
let changed = 0
for (const file of files) {
  const source = readFileSync(path.join(kentDir, file), 'utf8')
  const before = outcome(base.parse, source)
  const after = outcome(parse, source)
  if (before !== after) {
    changed++
    console.log(`${file}\n  ${baseRef}: ${before}\n  working tree: ${after}`)
  }
}
console.log(
  `${String(files.length)} files, ${String(changed)} parse differently from ${baseRef}`,
)
process.exitCode = changed ? 1 : 0
