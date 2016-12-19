'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getActionData = function getActionData(func, args) {
  var defaultArg = args.length === 1 ? args[0] : args;
  return typeof func === 'function' ? func.apply(undefined, _toConsumableArray(args)) : defaultArg;
};

var createStateActionFunc = function createStateActionFunc(actionType, fetchActionCreator, metaCreator) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return function (dispatch, getState) {
      return dispatch({
        type: actionType,
        payload: getActionData(fetchActionCreator, [{ dispatch: dispatch, getState: getState }].concat(args)),
        meta: getActionData(metaCreator, args)
      });
    };
  };
};

var createActionFunc = function createActionFunc(actionType, fetchActionCreator, metaCreator) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return {
      type: actionType,
      payload: getActionData(fetchActionCreator, args),
      meta: getActionData(metaCreator, args)
    };
  };
};

var functionCreator = function functionCreator(func) {
  return function (actionName, actionCreator, metaCreator) {
    var creator = function creator() {
      return func(actionName, actionCreator, metaCreator).apply(undefined, arguments);
    };
    creator.toString = function () {
      return actionName;
    };
    return creator;
  };
};

var createAction = exports.createAction = function createAction(actionName, actionCreator, metaCreator) {
  return functionCreator(createActionFunc)(actionName, actionCreator, metaCreator);
};

var createActionWithState = exports.createActionWithState = function createActionWithState(actionName, actionCreator, metaCreator) {
  return functionCreator(createStateActionFunc)(actionName, actionCreator, metaCreator);
};