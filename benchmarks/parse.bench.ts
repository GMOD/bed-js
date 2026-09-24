import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'

import { bench, describe } from 'vitest'

import BedBranch1 from '../esm_branch1/index.js'
import BedBranch2 from '../esm_branch2/index.js'

const branch1Name = readFileSync('esm_branch1/branchname.txt', 'utf8').trim()
const branch2Name = readFileSync('esm_branch2/branchname.txt', 'utf8').trim()

function load(file: string) {
  const text = gunzipSync(readFileSync(`benchmarks/data/${file}`)).toString()
  const all = text.split('\n').filter(Boolean)
  const header = all.find(l => l.startsWith('#'))
  const columnNames = header?.replace(/^#/, '').split('\t')
  const lines = all.filter(l => !l.startsWith('#')).map(l => l.split('\t'))
  return { lines, opts: columnNames ? { columnNames } : {} }
}

function benchParse(file: string) {
  const { lines, opts } = load(file)
  const parser1 = new BedBranch1(opts)
  const parser2 = new BedBranch2(opts)

  // both builds must read every line the same before either is timed
  for (const [i, fields] of lines.entries()) {
    const a = JSON.stringify(parser1.parseLine(fields, { uniqueId: `u${i}` }))
    const b = JSON.stringify(parser2.parseLine(fields, { uniqueId: `u${i}` }))
    if (a !== b) {
      throw new Error(`${file} line ${i} differs:\n${a}\n${b}`)
    }
  }

  describe(`${file} (${lines.length} lines)`, () => {
    bench(branch1Name, () => {
      for (const [i, fields] of lines.entries()) {
        parser1.parseLine(fields, { uniqueId: `u${i}` })
      }
    })
    bench(branch2Name, () => {
      for (const [i, fields] of lines.entries()) {
        parser2.parseLine(fields, { uniqueId: `u${i}` })
      }
    })
  })
}

benchParse('hs1-repeatmasker.bed.gz')
benchParse('hprc-genes-bed12.bed.gz')
benchParse('giant-bmi-gwas.bed.gz')
benchParse('encode-subcompartments.bed.gz')
benchParse('colo829-modkit.bed.gz')
