const CracoAlias = require('craco-alias');

module.exports = {
  webpack: {
    alias: {
      ...CracoAlias({
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.paths.json",
      }),
    },
  },
  babel: {
    plugins: process.env.NODE_ENV === 'development' ? ['react-refresh/babel'] : [],
  },
};
