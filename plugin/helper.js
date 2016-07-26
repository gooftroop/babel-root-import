import path from 'path';
import slash from 'slash';

const root = slash(global.rootPath || process.cwd());

export const pathPathPrefixTester = (rootPathPrefix) => {
    // const s = rootPathPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`(${rootPathPrefix}){1}`, 'i');
};

export const hasRootPathPrefixInString = (importPath, importPathRegex) => {
    if (typeof importPath === 'string') {
        return importPathRegex.test(importPath);
    }

    return false;
};

export const transformRelativeToRootPath = (importPath, rootPathSuffix = '', rootPathPrefix = '~') => {
    const importPathRegex = pathPathPrefixTester(rootPathPrefix);

    if (hasRootPathPrefixInString(importPath, importPathRegex)) {
        let normalizedPath = importPath.replace(importPathRegex, rootPathSuffix);
        normalizedPath = path.join(root, normalizedPath);
        return normalizedPath;
    }

    if (typeof importPath === 'string') {
        return importPath;
    }

    throw new Error('ERROR: No path passed');
};
