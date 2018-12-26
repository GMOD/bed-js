const parser = require('./autoSql')

const types = {}[
  ('bigInteract',
  'bigMaf',
  'bigPsl',
  'bigNarrowPeak',
  'bigGenePred',
  'bigChain',
  'bigLink')
].forEach(e => {
  const ret = parser.parse(`./as/${e}`)
  types[e] = ret
})

module.exports = types
