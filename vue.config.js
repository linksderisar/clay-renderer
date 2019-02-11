// vue.config.js
module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      return {
        externals: {
          jexl: 'jexl',
          lodash: 'lodash',
        },
      };
    }

    // mutate for development...
  },
};
