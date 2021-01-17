export const formatGrinAmount = (amount: number): number => {
  return amount / Math.pow(10, 9);
};

export const getTextFileContent = (filePath: string): string => {
  return require("fs").readFileSync(filePath, "utf8");
};

export const validateUrl = (url: string): boolean => {
  return /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi.test(
    url
  );
};

export const validateSlatepackAddress = (address: string): boolean => {
  if (address.length === 63) {
    const slatepack_fmt = "grin1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}";
    return new RegExp(`${slatepack_fmt}`).test(address.toLowerCase());
  }

  return false;
};

export const validateAddress = (
  address: string
): "http" | "slatepack" | false => {
  address = address.replace(/\/$/, "");
  if (validateSlatepackAddress(address)) {
    return "slatepack";
  } else if (validateUrl(address)) return "http";
  return false;
};

export const validateSlatepack = (slate: string): boolean => {
  return (
    slate.toUpperCase().includes("BEGINSLATEPACK.") &&
    slate.toUpperCase().includes("ENDSLATEPACK.")
  );
};

export const getUiLogsLocation = function(): string {
  const path = require("path");
  /*
  By default, it writes logs to the following locations:
    on Linux: ~/.config/Grin++/logs/renderer.log
    on macOS: ~/Library/Logs/Grin++/renderer.log
    on Windows: %USERPROFILE%\AppData\Roaming\Grin++\logs\renderer.log
  */
  const appName = "Grin++";
  const home = require("os").homedir();

  const location = (() => {
    switch (require("electron").remote.process.platform) {
      case "linux":
        return `${home}${path.sep}.config${path.sep}${appName}${path.sep}logs${path.sep}renderer.log`;
      case "darwin":
        return `${home}${path.sep}Library${path.sep}Logs${path.sep}${appName}${path.sep}renderer.log`;
      case "win32":
        return `${home}${path.sep}AppData${path.sep}Roaming${path.sep}${appName}${path.sep}logs${path.sep}renderer.log`;

      default:
        throw new Error("Unknown Platform");
    }
  })();
  return path.resolve(path.normalize(location));
};
