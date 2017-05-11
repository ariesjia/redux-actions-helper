'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createThunkAction = exports.createAction = undefined;

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _split = require('lodash/split');

var _split2 = _interopRequireDefault(_split);

var _createActionPrefix = require('./createActionPrefix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getActionData = function getActionData(func, args) {
  var defaultArg = args.length <= 1 ? args[0] : args;
  return ((0, _isFunction2.default)(func) ? func.apply(undefined, _toConsumableArray(args)) : func) || defaultArg;
};

var getMultiActionName = function getMultiActionName(name) {
  var splitName = (0, _split2.default)(name, '|', 2);
  return {
    functionName: splitName[0],
    actionNamePostfix: (0, _isUndefined2.default)(splitName[1]) ? splitName[0] : splitName[1]
  };
};

var generateMulti = function generateMulti(obj, multi, func) {
  if (multi && (0, _isArray2.default)(multi)) {
    return multi.reduce(function (prev, name) {
      var nameConfig = getMultiActionName(name);
      prev[nameConfig.functionName] = func(nameConfig.actionNamePostfix);
      return prev;
    }, obj);
  }
};

var functionCreator = function functionCreator(func) {
  return function (actionName, payloadCreator, metaCreator, multi) {
    var multiActions = generateMulti({}, multi, function (name) {
      return createAction((0, _createActionPrefix.getActionName)(actionName)(name), null, null, false);
    });
    var creator = function creator() {
      return func(actionName, payloadCreator, metaCreator, multiActions).apply(undefined, arguments);
    };
    creator.toString = (0, _createActionPrefix.getActionName)(actionName);
    Object.assign(creator, multiActions);
    return creator;
  };
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

var createThunkActionFunc = function createThunkActionFunc(actionType, payloadCreator, metaCreator, multiAactions) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return function (dispatch, getState) {
      return dispatch({
        type: actionType,
        payload: getActionData(payloadCreator, [{
          dispatch: dispatch,
          getState: getState,
          action: multiAactions
        }].concat(args)),
        meta: getActionData(metaCreator, args)
      });
    };
  };
};

var createAction = exports.createAction = function createAction(actionName, payloadCreator, metaCreator) {
  var multi = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ['success', 'fail'];

  return functionCreator(createActionFunc)(actionName, payloadCreator, metaCreator, multi);
};

var createThunkAction = exports.createThunkAction = function createThunkAction(actionName, payloadCreator, metaCreator) {
  var multi = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ['pending|', 'success', 'fail'];

  return functionCreator(createThunkActionFunc)(actionName, payloadCreator, metaCreator, multi);
};