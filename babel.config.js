module.exports = function(api) {
    const isDevelopment = api.env('development');
    presets: ['react-app'],
    plugins: [
      '@babel/plugin-proposal-private-property-in-object',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-nullish-coalescing-operator',
      '@babel/plugin-transform-numeric-separator',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-private-methods',
      isDevelopment && 'react-refresh/babel',
    ].filter(Boolean)
  };
  
