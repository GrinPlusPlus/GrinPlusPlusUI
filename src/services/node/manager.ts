import { IWalletSettings } from "../../interfaces/IWalletSettings";
import { retry } from "ts-retry";

export const getCommand = function(): string {
  const cmd = (() => {
    switch (require("electron").remote.process.platform) {
      case "win32":
        return "GrinNode.exe";
      case "darwin":
        return "GrinNode";
      case "linux":
        return "GrinNode";
      default:
        throw new Error("Unknown Platform");
    }
  })();
  return cmd;
};

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
        throw new Error("Unknown Platform");
    }
  })();
  const results = require("child_process").execSync(cmd, {
    windowsHide: true,
    encoding: "utf-8",
  });
  return results.toLowerCase().indexOf(processName.toLowerCase()) > -1;
};

const killProcess = function(processName: string): void {
  require("electron-log").info("Calling killProcess");
  const cmd = (() => {
    switch (require("electron").remote.process.platform) {
      case "win32":
        return `taskkill /F /IM ${processName}`;
      case "darwin":
        return `pkill -9 ${processName}`;
      case "linux":
        return `pkill -9 ${processName}`;
      default:
        throw new Error("Unknown Platform");
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
  const params = isFloonet ? ["--headless", "--floonet"] : ["--headless"];
  const absolutePath = getAbsoluteNodePath(mode, nodePath);
  const command = getCommandPath(absolutePath);

  require("electron-log").info(`Trying to run Backend: ${command}`);
  let node = require("child_process").spawn(command, params, {
    windowsHide: true,
    encoding: "utf-8",
    detached: true,
    shell: false,
    cwd: absolutePath,
  });
  require("electron-log").info(`Backend spawned pid: ${node.pid}`);
  node.stdout.on("data", function(data: any) {
    require("electron-log").info(data.toString());
  });
  node.stderr.on("data", function(data: any) {
    require("electron-log").error(data.toString());
  });
  node.on("close", (code: number) => {
    require("electron-log").info(`Backend process exited with code ${code}`);
  });
};

export const isNodeRunning = async function(
  retries: number = 0
): Promise<boolean> {
  const log = require("electron-log");
  const command = getCommand();
  let isRunning: boolean | undefined = false;
  try {
    isRunning = await retry(
      () => {
        log.info(`Checking if ${command} is running...`);
        if (isProcessRunning(command)) {
          log.info(`${command} is running`);
          return true;
        }
        throw new Error(`${command} not found...`);
      },
      { delay: 1000, maxTry: retries }
    );
  } catch (error) {
    log.error(`${command} is not running: ${error.message}`);
  }
  return isRunning ? true : false;
};

export const stopNode = function(): void {
  try {
    killProcess(getCommand());
  } catch (e) {}
};

export const getDefaultSettings = function(
  file: string = "defaults.json"
): IWalletSettings {
  const filePath = require("path").join(
    require("electron").remote.app.getAppPath(),
    file
  );
  const defaults = JSON.parse(require("fs").readFileSync(filePath, "utf8"));

  let node: any = {};
  if (require("fs").existsSync(getConfigFilePath())) {
    const fs = require("fs");
    const data = fs.readFileSync(getConfigFilePath(), "utf8");
    node = JSON.parse(data);
  }

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
    grinChckAddress: defaults.grinChckAddress,
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
