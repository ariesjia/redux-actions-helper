'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fluxStandardAction = require('flux-standard-action');

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isNull = require('lodash/isNull');

var _isNull2 = _interopRequireDefault(_isNull);

var _createActionPrefix = require('./createActionPrefix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function isDeferred(val) {
  return val && val.promise && isPromise(val.promise);
}

function getPromiseFinishMeta(action) {
  return action.meta && action.meta.PROMISE_ACTION ? _extends({}, action.meta, {
    PROMISE_ACTION: _extends({}, (0, _omit2.default)(action.meta.API_ACTION, 'PROMISE_START'), {
      PROMISE_FINISH: true
    })
  }) : null;
}

function getPromiseStartMeta(action) {
  var originMeta = action.meta;
  var meta = void 0;
  if ((0, _isUndefined2.default)(originMeta) || (0, _isNull2.default)(originMeta)) {
    meta = {};
  } else if ((0, _isObject2.default)(originMeta)) {
    meta = originMeta;
  } else {
    meta = {
      origin: originMeta
    };
  }
  return Object.assign({}, meta, {
    PROMISE_START: true
  });
}

exports.default = function (_ref) {
  var dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      if (!(0, _fluxStandardAction.isFSA)(action)) {
        return next(action);
      }

      if (isPromise(action.payload)) {
        action.payload.then(function (result) {
          dispatch(_extends({}, action, {
            payload: result,
            type: (0, _createActionPrefix.getActionName)(action.type)('success'),
            meta: getMeta(action)
          }));
        }).catch(function (error) {
          dispatch(_extends({}, action, {
            error: true,
            payload: error instanceof Error ? error.message : error,
            type: (0, _createActionPrefix.getActionName)(action.type)('fail'),
            meta: getPromiseFinishMeta(action)
          }));
        });
        next(_extends({}, action, {
          meta: getPromiseStartMeta(action)
        }));
        return action.payload;
      } else if (isDeferred(action.payload)) {
        next(_extends({}, action, {
          meta: getPromiseStartMeta(action)
        }));
        return action.payload.promise;
      } else {
        next(action);
      }
      return null;
    };
  };
};