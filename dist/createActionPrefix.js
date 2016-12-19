'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = require('lodash/curry');

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createActionPrefix = (0, _curry2.default)(function (prefix, actionName) {
  return prefix + '-ACTION-' + actionName;
});

exports.default = createActionPrefix;