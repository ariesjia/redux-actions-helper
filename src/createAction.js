import isFunction from 'lodash/isFunction'
import isArray from 'lodash/isArray'
import { getActionName } from './createActionPrefix'

const getActionData = (func, args) => {
  const defaultArg  = args.length <= 1  ? args[0] : args
  return (isFunction(func) ? func(...args) : func) || defaultArg
}

const createActionFunc = (actionType, payloadCreator, metaCreator) =>
  (...args) => ({
    type: actionType,
    payload: getActionData(payloadCreator, args),
    meta: getActionData(metaCreator, args),
  })

const generateMulti = (obj,multi,func)=>{
  if(multi && isArray(multi)){
    return multi.reduce((prev, name)=>{
      prev[name] = func(name)
      return prev
    },obj)
  }
}

const functionCreator = (func) => (actionName, payloadCreator, metaCreator, multi) => {
  const multiActions = generateMulti({},multi,(name)=>{
    return createAction(getActionName(actionName)(name),null,null,false)
  })
  const creator = (...args) => func(
    actionName, payloadCreator, metaCreator, multiActions
  )(...args)
  creator.toString = getActionName(actionName)
  Object.assign(creator,multiActions)
  return creator;
}

const createThunkActionFunc = (actionType, payloadCreator, metaCreator, multiAactions) =>
  (...args) => (dispatch, getState) => dispatch({
    type: actionType,
    payload: getActionData(
      payloadCreator,
      [{
        dispatch,
        getState,
        action: multiAactions
      }].concat(args)),
    meta: getActionData(metaCreator, args),
  })

export const createAction = (actionName, payloadCreator, metaCreator, multi = ['success','fail']) => {
  return functionCreator(createActionFunc)(actionName, payloadCreator, metaCreator, multi)
};

export const createThunkAction = (actionName, payloadCreator, metaCreator, multi = ['success','fail']) => {
  return functionCreator(createThunkActionFunc)(actionName, payloadCreator, metaCreator, multi)
};
