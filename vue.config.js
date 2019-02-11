// vue.config.js
module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      return {
        externals: {
          moment: 'moment',
          axios: 'axios',
          'vue-class-component': 'vue-class-component',
          'vue-property-decorator': 'vue-property-decorator',
          'element-resize-detector': 'element-resize-detector',
          '@types/element-resize-detector': '@types/element-resize-detector',
        },
      };
    }

    // mutate for development...
  },
};
