module.exports = {
    presets: ['react-app'],
    plugins: [
      '@babel/plugin-proposal-private-property-in-object',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-nullish-coalescing-operator',
      '@babel/plugin-transform-numeric-separator',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-private-methods'
    ]
  };
  