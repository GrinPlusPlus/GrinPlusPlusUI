export const readFileAsText = function(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onabort = () => reject("Unknown error");
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result?.toString());
    reader.readAsText(file, "utf-8");
  });
};

export const formatGrinAmount = function(amount: number): number {
  return amount / Math.pow(10, 9);
};

export const getFileExtension = function(fileName: string): string | undefined {
  const re = /(?:\.([^.]+))?$/;
  const extension = re.exec(fileName);
  if (extension && extension[1]) return extension[1];
  return undefined;
};

export const validateExtension = function(
  fileName: string,
  ext: string
): boolean {
  const re = /(?:\.([^.]+))?$/;
  const extension: RegExpExecArray | null = re.exec(fileName);
  if (extension && extension[1] !== ext) return false;
  return true;
};

export const getTextFileContent = async function(file: File): Promise<string> {
  const content = await readFileAsText(file)
    .then((content) => content)
    .catch(() => "");
  return content;
};

export const validateUrl = function(url: string) {
  const expression = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;
  return new RegExp(expression).test(url);
};

export const validateOnion = function(url: string) {
  const v3 = "[a-z2-7]{56}";
  return new RegExp(`${v3}`).test(url);
};

export const validateAddress = function(
  address: string
): "http" | "tor" | false {
  if (validateUrl(address)) return "http";
  else if (validateOnion(address)) return "tor";
  return false;
};

export const fileExists = function(path: string): boolean {
  return require("fs").existsSync(path);
};

export const writeJson = function(path: string, data: any) {
  require("fs").writeFileSync(path, JSON.stringify(data));
};

export const getHomePath = function(): string {
  return require("electron").remote.app.getPath("home");
};

export const getPathSeparator = function(): string {
  switch (require("electron").remote.process.platform) {
    case "win32":
      return `\\`;
    default:
      return "/";
  }
};

export const validateFilePath = function(filePath: string): boolean {
  try {
    const fs = require("fs");
    const path = require("path").dirname(filePath);
    const info = fs.lstatSync(path);
    return info.isDirectory();
  } catch (e) {
    return false;
  }
};

export const saveAs = async function(
  path: string,
  filters: { name: string; extensions: string[] }[] = [
    { name: "Tx Files", extensions: ["tx"] },
    { name: "All Files", extensions: ["*"] },
  ]
): Promise<{ canceled: boolean; filePath: string }> {
  let results = await require("electron").remote.dialog.showSaveDialog({
    defaultPath: path,
    filters: filters,
  });
  return { canceled: results.canceled, filePath: results.filePath };
};
