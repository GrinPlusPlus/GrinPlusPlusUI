const isProcessRunning = function(processName: string): boolean {
  const cmd = (() => {
    switch (require("electron").remote.process.platform) {
      case "win32":
        return `tasklist`;
      case "darwin":
        return `ps -ax`;
      case "linux":
        return `ps -A`;
      default:
        return false;
    }
  })();
  const results = require("child_process").execSync(cmd, {
    windowsHide: true,
    encoding: "utf-8",
  });
  return results.toLowerCase().indexOf(processName.toLowerCase()) > -1;
};

const killProcess = function(processName: string): void {
  const cmd = (() => {
    switch (require("electron").remote.process.platform) {
      case "win32":
        return `taskkill /F /IM ${processName}`;
      case "darwin":
        return `pkill -9 ${processName}`;
      case "linux":
        return `pkill -9 ${processName}`;
      default:
        return false;
    }
  })();
  window
    .require("child_process")
    .execSync(cmd, { windowsHide: true, encoding: "utf-8" });
};

export const getNodeDataPath = function(floonet: boolean = false): string {
  const { remote } = require("electron");
  const net = !floonet ? "MAINNET" : "FLOONET";
  return `${remote.app.getPath("home")}/.GrinPP/${net}`;
};

export const getConfigFilePath = function(floonet: boolean = false): string {
  return `${getNodeDataPath(floonet)}/server_config.json`;
};

export const getConfigValue = function(file: string, property: string): number {
  const data = require("fs").readFileSync(file, "utf8");
  let settings = JSON.parse(data);
  if (["MIN_PEERS", "MAX_PEERS"].includes(property)) {
    if (settings["P2P"][property]) return +settings["P2P"][property];
    if (property === "MIN_PEERS") return 15;
    if (property === "MAX_PEERS") return 50;
  } else if (property === "MIN_CONFIRMATIONS") {
    if (settings["WALLET"][property])
      return +settings["WALLET"]["MIN_CONFIRMATIONS"];
    return 10;
  }
  return -1;
};

export const updateSettings = function(
  file: string,
  property: "MIN_PEERS" | "MAX_PEERS" | "MIN_CONFIRMATIONS" | undefined,
  value: number
): void {
  if (!property) return;
  const fs = require("fs");
  const data = fs.readFileSync(file, "utf8");
  let settings = JSON.parse(data);
  if (["MIN_PEERS", "MAX_PEERS"].includes(property)) {
    settings["P2P"][property] = value;
  } else if (property === "MIN_CONFIRMATIONS") {
    settings["WALLET"]["MIN_CONFIRMATIONS"] = value;
  }
  fs.writeFileSync(file, JSON.stringify(settings));
};

export const getCommand = function(): string {
  const { remote } = require("electron");
  const cmd = (() => {
    switch (remote.process.platform) {
      case "win32":
        return "GrinNode.exe";
      case "darwin":
        return "GrinNode";
      case "linux":
        return "GrinNode";
      default:
        return "";
    }
  })();
  return cmd;
};

export const getCommandPath = function(nodePath: string): string {
  return require("path").join(nodePath, getCommand());
};

export const runNode = function(
  nodePath: string,
  isFloonet: boolean = false
): void {
  const params = isFloonet ? ["", "--floonet"] : ["--headless"];
  const binaryPath = require("path").join(process.cwd(), nodePath);
  const command = getCommandPath(binaryPath);
  require("child_process").spawn(command, params, {
    windowsHide: true,
    encoding: "utf-8",
    detached: true,
    shell: false,
    cwd: binaryPath,
  });
};

export const isNodeRunning = function(): boolean {
  return isProcessRunning(getCommand());
};

export const stopNode = function(): void {
  killProcess(getCommand());
};

export const getDefaultSettings = function(
  file: string = "defaults.json"
): {
  ip: string;
  protocol: string;
  mode: "DEV" | "TEST" | "PROD";
  binaryPath: string;
  floonet: boolean;
  minimumPeers: number;
  maximumPeers: number;
  minimumConfirmations: number;
  ports: { node: number; foreignRPC: number; owner: number; ownerRPC: number };
  grinJoinAddress: string;
} {
  const filePath = require("path").join(
    require("electron").remote.app.getAppPath(),
    file
  );
  return JSON.parse(require("fs").readFileSync(filePath, "utf8"));
};

export const verifyNodePath = function(defaultPath: string): boolean {
  defaultPath = require("path").join(defaultPath, getCommand());
  return require("fs").existsSync(defaultPath);
};
