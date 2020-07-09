import parser from './autoSql'
import bigInteract from './as/bigInteract.as'
import bigMaf from './as/bigMaf.as'
import bigPsl from './as/bigPsl.as'
import bigNarrowPeak from './as/bigNarrowPeak.as'
import bigGenePred from './as/bigGenePred.as'
import bigLink from './as/bigLink.as'
import bigChain from './as/bigChain.as'
import mafFrames from './as/mafFrames.as'
import mafSummary from './as/mafSummary.as'
import defaultBedSchema from './as/defaultBedSchema.as'

const types = {
  bigInteract,
  bigMaf,
  bigPsl,
  bigNarrowPeak,
  bigGenePred,
  bigLink,
  bigChain,
  mafFrames,
  mafSummary,
  defaultBedSchema,
}
Object.keys(types).forEach((k) => {
  types[k] = parser.parse(types[k].trim())
})

export default types
