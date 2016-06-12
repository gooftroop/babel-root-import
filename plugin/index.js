import {hasRootPathPrefixInString, transformRelativeToRootPath} from './helper';

const replacePrefix = (path, opts = []) => {
  const options = [].concat(opts);

  for (let i = 0; i < options.length; i++) {
    let rootPathSuffix = '';
    let rootPathPrefix = '';
    const option = options[i];

    if (option.rootPathSuffix && typeof option.rootPathSuffix === 'string') {
      rootPathSuffix = `/${option.rootPathSuffix.replace(/^(\/)|(\/)$/g, '')}`;
    }

    if (option.rootPathPrefix && typeof option.rootPathPrefix === 'string') {
      rootPathPrefix = option.rootPathPrefix;
    } else {
      rootPathPrefix = '~';
    }

    if (hasRootPathPrefixInString(path, rootPathPrefix)) {
      return transformRelativeToRootPath(path, rootPathSuffix, rootPathPrefix);
    }
  }

  return path;
};

export default ({'types': t}) => ({
  'visitor': {
    CallExpression(path, state) {
      if (path.node.callee.name !== 'require') {
        return;
      }

      const args = path.node.arguments;
      if (!args.length) {
        return;
      }

      const firstArg = args[0];
      // If the require is `require('~/' + 'blah')` we can still change it
      if (t.isBinaryExpression(firstArg) && t.isStringLiteral(firstArg.left)) {
        firstArg.left.value = replacePrefix(firstArg.left.value, state.opts);
      } else if (t.isLiteral(firstArg)) {
        firstArg.value = replacePrefix(firstArg.value, state.opts);
      }
    },
    ImportDeclaration(path, state) {
      path.node.source.value = replacePrefix(path.node.source.value, state.opts);
    }
  }
});
