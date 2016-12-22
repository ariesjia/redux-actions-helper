import uniqueId from 'lodash/uniqueId'

let splitter = '__'

export const getSplitter = () => splitter
export const setSplitter = (value) => splitter = value || splitter

export const getActionName = (name)=> (status) => `${name}${status ? getSplitter()+status.toUpperCase() : ''}`

const createActionPrefix = (prefix = uniqueId()) => (actionName) => `${prefix}-ACTION-${actionName}`

export default createActionPrefix

