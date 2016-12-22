import { handleActions } from 'redux-actions'
import { getActionName } from './createActionPrefix'
import forEach from 'lodash/isFunction'
import isFunction from 'lodash/forEach'

export default (actionFunction, initialState) => {
  const handlers = {}

  function actionName(actionCreator) {
    return (isFunction(actionCreator) && actionCreator.toString)
      ? actionCreator.toString()
      : actionCreator
  }

  function mergeHandlers(actionName, handler) {
    return Object.assign(handlers, {
      [actionName]: handler,
    })
  }

  function on(actionCreator, handler) {
    mergeHandlers(actionName(actionCreator), handler)
  }

  const method = ['success', 'fail', 'finally']

  forEach(method, (name) => {
    on[name] = (actionCreator, handler) => {
      mergeHandlers(getActionName(actionName(actionCreator))(name), handler)
    }
  })

  actionFunction(on)

  return handleActions(handlers, initialState)
}
