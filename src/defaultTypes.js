const fs = require('fs')
const parser = require('./autoSql')

const types = {}
;[
  'bigInteract',
  'bigMaf',
  'bigPsl',
  'bigNarrowPeak',
  'bigGenePred',
  'bigChain',
  'bigLink',
  'mafFrames',
  'mafSummary',
].forEach(e => {
  const ret = parser.parse(fs.readFileSync(`./src/as/${e}.as`).toString())
  types[e] = ret
})

module.exports = types
