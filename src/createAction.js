import isFunction from 'lodash/forEach'

const getActionData = (func, args) => {
  const defaultArg  = args.length === 1 ? args[0] : args
  return isFunction(func) ? func(...args) : defaultArg
}

const getName = (name)=> (status) => `${name}${status ? '__'+status.toUpperCase() : ''}`

const createActionFunc = (actionType, payloadCreator, metaCreator) =>
  (...args) => ({
    type: actionType,
    payload: getActionData(payloadCreator, args),
    meta: getActionData(metaCreator, args),
  })

const functionCreator = (func) => (actionName, payloadCreator, metaCreator, multi) => {
  const creator = (...args) => func(
    actionName, payloadCreator, metaCreator
  )(...args)
  creator.toString = getName(actionName)
  if(multi){
    creator.success = createAction(getName(actionName)('success'),null,null,false)
    creator.fail = createAction(getName(actionName)('fail'),null,null,false)
  }
  return creator;
}

export const createAction = (actionName, payloadCreator, metaCreator, multi = true) => {
  return functionCreator(createActionFunc)(actionName, payloadCreator, metaCreator, multi)
};

const createThunkActionFunc = (actionType, payloadCreator, metaCreator) =>
  (...args) => (dispatch, getState) => dispatch({
    type: actionType,
    payload: getActionData(payloadCreator, [{ dispatch, getState }].concat(args)),
    meta: getActionData(metaCreator, args),
  })

export const createThunkAction = (actionName, payloadCreator, metaCreator) => {
  return functionCreator(createThunkActionFunc)(actionName, payloadCreator, metaCreator)
};
