'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fluxStandardAction = require('flux-standard-action');

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function isDeferred(val) {
  return val && val.promise && isPromise(val.promise);
}

function getMeta(action) {
  return action.meta && action.meta.PROMISE_ACTION ? _extends({}, action.meta, {
    PROMISE_ACTION: _extends({}, (0, _omit2.default)(action.meta.API_ACTION, 'PROMISE_START'), {
      PROMISE_FINISH: true
    })
  }) : null;
}

exports.default = function (_ref) {
  var dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      if (!(0, _fluxStandardAction.isFSA)(action)) {
        return next(action);
      }

      next(action);

      if (isPromise(action.payload)) {
        action.payload.then(function (result) {
          dispatch(_extends({}, action, {
            payload: result,
            type: action.type + '__SUCCESS',
            meta: getMeta(action)
          }));
        }).catch(function (error) {
          dispatch(_extends({}, action, {
            error: true,
            payload: error instanceof Error ? error.message : error,
            type: action.type + '__FAIL',
            meta: getMeta(action)
          }));
        });
        return action.payload;
      } else if (isDeferred(action.payload)) {
        return action.payload.promise;
      }
      return null;
    };
  };
};