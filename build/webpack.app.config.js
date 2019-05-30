const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");

module.exports = env => {
  return merge(base(env), {
    entry: {
      background: "./src/index.js",
      renderer: "./src/renderer/RenderApp.js"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../app")
    }
  });
};
