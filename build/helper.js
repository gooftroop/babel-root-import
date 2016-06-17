'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformRelativeToRootPath = exports.hasRootPathPrefixInString = undefined;

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = (0, _slash2.default)(global.rootPath || process.cwd());

var hasRootPathPrefixInString = exports.hasRootPathPrefixInString = function hasRootPathPrefixInString(importPath) {
  var rootPathPrefix = arguments.length <= 1 || arguments[1] === undefined ? '~' : arguments[1];

  var containsRootPathPrefix = false;

  if (typeof importPath === 'string') {
    if (importPath.substring(0, 1) === rootPathPrefix) {
      containsRootPathPrefix = true;
    }

    var firstTwoCharactersOfString = importPath.substring(0, 2);
    if (firstTwoCharactersOfString === rootPathPrefix + '/') {
      containsRootPathPrefix = true;
    }
  }

  return containsRootPathPrefix;
};

var transformRelativeToRootPath = exports.transformRelativeToRootPath = function transformRelativeToRootPath(importPath, rootPathSuffix, rootPathPrefix) {
  var withoutRootPathPrefix = '';
  if (hasRootPathPrefixInString(importPath, rootPathPrefix)) {
    if (importPath.substring(0, 1) === '/') {
      withoutRootPathPrefix = importPath.substring(1, importPath.length);
    } else {
      withoutRootPathPrefix = importPath.substring(2, importPath.length);
    }
    return (0, _slash2.default)('' + root + (rootPathSuffix ? rootPathSuffix : '') + '/' + withoutRootPathPrefix);
  }

  if (typeof importPath === 'string') {
    return importPath;
  }

  throw new Error('ERROR: No path passed');
};