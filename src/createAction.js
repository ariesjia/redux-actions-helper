import isFunction from 'lodash/isFunction'
import isArray from 'lodash/isArray'
import isUndefined from 'lodash/isUndefined'
import split from 'lodash/split'
import { getActionName } from './createActionPrefix'

const getActionData = (func, args) => {
  const defaultArg  = args.length <= 1  ? args[0] : args
  return (isFunction(func) ? func(...args) : func) || defaultArg
}

const getMultiActionName = (name) => {
  const splitName = split(name, '|', 2);
  return {
    functionName: splitName[0],
    actionNamePostfix: isUndefined(splitName[1]) ? splitName[0] : splitName[1],
  }
}

const generateMulti = (obj,multi,func)=>{
  if(multi && isArray(multi)){
    return multi.reduce((prev, name)=>{
      const nameConfig = getMultiActionName(name);
      prev[nameConfig.functionName] = func(nameConfig.actionNamePostfix)
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
  creator.actionName = actionName
  Object.assign(creator,multiActions)
  return creator;
}

const createActionFunc = (actionType, payloadCreator, metaCreator) =>
  (...args) => ({
    type: actionType,
    payload: getActionData(payloadCreator, args),
    meta: getActionData(metaCreator, args),
  })

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

export const createThunkAction = (actionName, payloadCreator, metaCreator, multi = ['pending|','success','fail']) => {
  return functionCreator(createThunkActionFunc)(actionName, payloadCreator, metaCreator, multi)
};
