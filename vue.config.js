const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    resolve: {
      alias: {
        'inferno': 'inferno/dist/index.dev.esm.js',
      }
  }
  },
  devServer: {
    proxy: {
       // proxy all requests starting with /api to jsonplaceholder
      '/api': {
        target: 'http://localhost:4000/',
        changeOrigin: true
      },
    },
  },
  // npm run build 한 경우 productionTest 폴더 안에 존재
  //publicPath: process.env.NODE_ENV === 'production'
  //  ? '/FEMSproduction/'
  //  : '/'
});