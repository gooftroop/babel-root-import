'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('./helper');

var replacePrefix = function replacePrefix(path) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var options = [].concat(opts);

  for (var i = 0; i < options.length; i++) {
    var rootPathSuffix = '';
    var rootPathPrefix = '';
    var option = options[i];

    if (option.rootPathSuffix && typeof option.rootPathSuffix === 'string') {
      rootPathSuffix = '/' + option.rootPathSuffix.replace(/^(\/)|(\/)$/g, '');
    }

    if (option.rootPathPrefix && typeof option.rootPathPrefix === 'string') {
      rootPathPrefix = option.rootPathPrefix;
    } else {
      rootPathPrefix = '~';
    }

    if ((0, _helper.hasRootPathPrefixInString)(path, rootPathPrefix)) {
      return (0, _helper.transformRelativeToRootPath)(path, rootPathSuffix, rootPathPrefix);
    }
  }

  return path;
};

/**
 * Recursively traverses binary  expressions to find the first `StringLiteral` if any.
 * @param  {Object} t           Babel types
 * @param  {Node} arg           a Babel node
 * @return {StringLiteral?}
 */
var traverseExpression = function traverseExpression(t, arg) {
  if (t.isStringLiteral(arg)) {
    return arg;
  }

  if (t.isBinaryExpression(arg)) {
    return traverseExpression(t, arg.left);
  }

  return null;
};

exports.default = function (_ref) {
  var t = _ref['types'];
  return {
    'visitor': {
      CallExpression: function CallExpression(path, state) {
        if (path.node.callee.name !== 'require') {
          return;
        }

        var args = path.node.arguments;
        if (!args.length) {
          return;
        }

        var firstArg = traverseExpression(t, args[0]);

        if (firstArg) {
          firstArg.value = replacePrefix(firstArg.value, state.opts);
        }
      },
      ImportDeclaration: function ImportDeclaration(path, state) {
        path.node.source.value = replacePrefix(path.node.source.value, state.opts);
      }
    }
  };
};