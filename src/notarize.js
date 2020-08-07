const path = require("path");
const { notarize } = require("electron-notarize");

const configPath = path.resolve(__dirname, "../package.json");
const config = require(configPath);

exports.default = async function notarizing(context) {
  if (process.platform !== "darwin") {
    return;
  }

  const outDir = context.appOutDir;
  const appName = context.packager.appInfo.productFilename;
  console.log(`afterSign: Notarizing ${config.build.appId}`);
  await notarize({
    appBundleId: config.build.appId,
    appPath: `${outDir}/${appName}.app`,
    appleId: "davidburkett38@gmail.com",
    appleIdPassword: process.env.APPLE_PASSWORD
  });
  console.log("afterSign: Notarized");
};
