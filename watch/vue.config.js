module.exports = {
  publicPath: "",
  outputDir: "../dist",
  assetsDir: "assets",
  indexPath: "index.html",
  configureWebpack: {
    devServer: {
      host: '0.0.0.0',
      port: 8002,
      allowedHosts: [
        'localhost',
        '.cesium.tv'
      ],
    },
  },
};
