const path = require("path");

module.exports = {
  webpack: {
    configure: {
      target: "electron-renderer",
      node: {
        __dirname: false,
      },
    },
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
};
