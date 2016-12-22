'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxActions = require('redux-actions');

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (actionFunction, initialState) {
  var handlers = {};

  function getActionName(actionCreator) {
    return (0, _forEach2.default)(actionCreator) && actionCreator.toString ? actionCreator.toString() : actionCreator;
  }

  function mergeHandlers(actionName, handler) {
    return Object.assign(handlers, _defineProperty({}, actionName, handler));
  }

  function on(actionCreator, handler) {
    mergeHandlers(getActionName(actionCreator), handler);
  }

  var method = ['success', 'fail', 'finally'];

  (0, _isFunction2.default)(method, function (name) {
    on[name] = function (actionCreator, handler) {
      mergeHandlers(getActionName(actionCreator) + '__' + name.toUpperCase(), handler);
    };
  });

  actionFunction(on);

  return (0, _reduxActions.handleActions)(handlers, initialState);
};