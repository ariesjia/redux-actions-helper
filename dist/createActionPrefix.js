'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionName = exports.setSplitter = exports.getSplitter = undefined;

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var splitter = '__';

var getSplitter = exports.getSplitter = function getSplitter() {
  return splitter;
};
var setSplitter = exports.setSplitter = function setSplitter(value) {
  return splitter = value || splitter;
};

var getActionName = exports.getActionName = function getActionName(name) {
  return function (status) {
    return '' + name + (status ? getSplitter() + status.toUpperCase() : '');
  };
};

var createActionPrefix = function createActionPrefix() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _uniqueId2.default)();
  return function (actionName) {
    return prefix + '-ACTION-' + actionName;
  };
};

exports.default = createActionPrefix;