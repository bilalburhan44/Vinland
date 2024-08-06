module.exports = function (api) {
  api.cache(true);

  const presets = ['react-app', "@babel/preset-env", "@babel/preset-react"];
  const plugins = [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-transform-numeric-separator',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-private-methods',
    process.env.NODE_ENV === 'development' ? 'react-refresh/babel' : null,
  ].filter(Boolean);

  return {
    presets,
    plugins,
  };
};
