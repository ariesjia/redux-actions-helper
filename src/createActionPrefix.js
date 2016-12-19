import curry from 'lodash/curry'

const createActionPrefix = curry((prefix, actionName) =>
  (`${prefix}-ACTION-${actionName}`)
)

export default createActionPrefix
