const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve.fallback,
          "fs": false,
          "path": require.resolve("path-browserify"),
          "os": require.resolve("os-browserify/browser")
        }
      };

      if (env === 'production') {
        const babelLoader = webpackConfig.module.rules.find(
          rule => rule.loader && rule.loader.includes('babel-loader')
        );
      }

      return webpackConfig;
    }
  }
};
