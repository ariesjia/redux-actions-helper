'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createThunkAction = exports.createAction = undefined;

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _createActionPrefix = require('./createActionPrefix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getActionData = function getActionData(func, args) {
  var defaultArg = args.length === 1 ? args[0] : args;
  return (0, _forEach2.default)(func) ? func.apply(undefined, _toConsumableArray(args)) : defaultArg;
};

var createActionFunc = function createActionFunc(actionType, payloadCreator, metaCreator) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return {
      type: actionType,
      payload: getActionData(payloadCreator, args),
      meta: getActionData(metaCreator, args)
    };
  };
};

var functionCreator = function functionCreator(func) {
  return function (actionName, payloadCreator, metaCreator, multi) {
    var creator = function creator() {
      return func(actionName, payloadCreator, metaCreator).apply(undefined, arguments);
    };
    creator.toString = (0, _createActionPrefix.getActionName)(actionName);
    if (multi) {
      creator.success = createAction((0, _createActionPrefix.getActionName)(actionName)('success'), null, null, false);
      creator.fail = createAction((0, _createActionPrefix.getActionName)(actionName)('fail'), null, null, false);
    }
    return creator;
  };
};

var createAction = exports.createAction = function createAction(actionName, payloadCreator, metaCreator) {
  var multi = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  return functionCreator(createActionFunc)(actionName, payloadCreator, metaCreator, multi);
};

var createThunkActionFunc = function createThunkActionFunc(actionType, payloadCreator, metaCreator) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return function (dispatch, getState) {
      return dispatch({
        type: actionType,
        payload: getActionData(payloadCreator, [{ dispatch: dispatch, getState: getState }].concat(args)),
        meta: getActionData(metaCreator, args)
      });
    };
  };
};

var createThunkAction = exports.createThunkAction = function createThunkAction(actionName, payloadCreator, metaCreator) {
  return functionCreator(createThunkActionFunc)(actionName, payloadCreator, metaCreator);
};