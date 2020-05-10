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
    if (!settings["P2P"]) settings["P2P"] = {};
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

export const getAbsoluteNodePath = function(
  mode: "DEV" | "TEST" | "PROD",
  nodePath: string
): string {
  if (mode === "PROD") {
    return require("path").join(
      process.resourcesPath,
      "./app.asar.unpacked/" + nodePath
    );
  } else {
    return require("path").join(
      require("electron").remote.app.getAppPath(),
      nodePath
    );
  }
};

export const getCommandPath = function(nodePath: string): string {
  return require("path").join(nodePath, getCommand());
};

export const runNode = function(
  mode: "DEV" | "TEST" | "PROD",
  nodePath: string,
  isFloonet: boolean = false
): void {
  const params = isFloonet ? ["", "--floonet"] : ["--headless"];

  const absolutePath = getAbsoluteNodePath(mode, nodePath);
  const command = getCommandPath(absolutePath);
  require("child_process").spawn(command, params, {
    windowsHide: true,
    encoding: "utf-8",
    detached: true,
    shell: false,
    cwd: absolutePath,
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
  const defaults = JSON.parse(require("fs").readFileSync(filePath, "utf8"));

  const fs = require("fs");
  const data = fs.readFileSync(getConfigFilePath(), "utf8");
  let node = JSON.parse(data);

  return {
    ip: defaults.ip,
    protocol: defaults.protocol,
    mode: defaults.mode,
    binaryPath: defaults.binaryPath,
    floonet: defaults.floonet,
    minimumPeers:
      node["P2P"] && node["P2P"]["MIN_PEERS"]
        ? node["P2P"]["MIN_PEERS"]
        : defaults.minimumPeers,
    maximumPeers:
      node["P2P"] && node["P2P"]["MAX_PEERS"]
        ? node["P2P"]["MAX_PEERS"]
        : defaults.maximumPeers,
    minimumConfirmations:
      node["WALLET"] && node["WALLET"]["MIN_CONFIRMATIONS"]
        ? node["WALLET"]["MIN_CONFIRMATIONS"]
        : defaults.minimumConfirmations,
    ports: {
      node: defaults.ports.node,
      foreignRPC: defaults.ports.foreignRPC,
      owner: defaults.ports.owner,
      ownerRPC: defaults.ports.ownerRPC,
    },
    grinJoinAddress: defaults.grinJoinAddress,
  };
};

export const verifyNodePath = function(
  mode: "DEV" | "TEST" | "PROD",
  defaultPath: string
): boolean {
  defaultPath = getCommandPath(getAbsoluteNodePath(mode, defaultPath));
  require("electron-log").info(`Node Location: ${defaultPath}`);
  return require("fs").existsSync(defaultPath);
};
