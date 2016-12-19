const getActionData = (func, args) => {
  const defaultArg  = args.length === 1 ? args[0] : args
  return typeof func === 'function' ? func(...args) : defaultArg
}

const createStateActionFunc = (actionType, fetchActionCreator, metaCreator) =>
  (...args) => (dispatch, getState) => dispatch({
    type: actionType,
    payload: getActionData(fetchActionCreator, [{ dispatch, getState }].concat(args)),
    meta: getActionData(metaCreator, args),
  })

const createActionFunc = (actionType, fetchActionCreator, metaCreator) =>
  (...args) => ({
    type: actionType,
    payload: getActionData(fetchActionCreator, args),
    meta: getActionData(metaCreator, args),
  })

const functionCreator = (func) => (actionName, actionCreator, metaCreator) => {
  const creator = (...args) => func(
    actionName, actionCreator, metaCreator
  )(...args)
  creator.toString = () => actionName
  return creator;
}

export const createAction = (actionName, actionCreator, metaCreator) => {
  return functionCreator(createActionFunc)(actionName, actionCreator, metaCreator)
};

export const createActionWithState = (actionName, actionCreator, metaCreator) => {
  return functionCreator(createStateActionFunc)(actionName, actionCreator, metaCreator)
};
