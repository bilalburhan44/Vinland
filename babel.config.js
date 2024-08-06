module.exports = function (api) {
  api.cache(true);

  const presets = ['react-app'];
  const plugins = [
    '@babel/plugin-proposal-private-property-in-object',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-transform-numeric-separator',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-private-methods',
  ];

  if (process.env.NODE_ENV === 'development') {
    plugins.push(require('react-refresh/babel'));
  }

  return {
    presets,
    plugins,
  };
};
