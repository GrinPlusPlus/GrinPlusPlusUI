module.exports = (config) => {
  config.target = "electron-renderer";
  config.devServer = {
    disableHostCheck: true,
  };
  return config;
};
