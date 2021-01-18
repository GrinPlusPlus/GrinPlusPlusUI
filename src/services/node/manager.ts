import { IWalletSettings } from "../../interfaces/IWalletSettings";
import { retryAsync } from "ts-retry";
import { getTextFileContent } from "../utils";

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

export const getTorCommand = function(): string {
  const cmd = (() => {
    switch (require("electron").remote.process.platform) {
      case "win32":
        return "tor.exe";
      case "darwin":
        return "tor";
      case "linux":
        return "tor";
      default:
        throw new Error("Unknown Platform");
    }
  })();
  return cmd;
};

export const getRustNodeProcess = function(): string {
  const cmd = (() => {
    switch (require("electron").remote.process.platform) {
      case "win32":
        return "Grin.exe";
      case "darwin":
        return "Grin";
      case "linux":
        return "Grin";
      default:
        throw new Error("Unknown Platform");
    }
  })();
  return cmd;
};

const isProcessRunning = function(processName: string): Promise<boolean> {
  const cmd = (() => {
    switch (require("os").platform()) {
      case "win32":
        return `wmic process where "name = '${processName}'" get commandline`;
      case "darwin":
        return `ps -ax | grep ${processName}`;
      case "linux":
        return `ps -A`;
      default:
        return false;
    }
  })();

  return new Promise((resolve, reject) => {
    require("child_process").exec(
      cmd,
      (err: Error, stdout: string, stderr: string) => {
        if (err) reject(err);
        if (require("electron").remote.process.platform === "win32") {
          resolve(
            stdout.toLowerCase().indexOf("CommandLine".toLowerCase()) > -1
          );
        } else {
          resolve(stdout.toLowerCase().indexOf(processName.toLowerCase()) > -1);
        }
      }
    );
  });
};

const killProcess = function(processName: string): void {
  require("electron-log").info("Calling killProcess");
  const cmd = (() => {
    switch (require("electron").remote.process.platform) {
      case "win32":
        return `taskkill /F /IM ${processName}`;
      case "darwin":
        return `killall ${processName}`;
      case "linux":
        return `killall ${processName}`;
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
  const path = require("path");
  const net = !floonet ? "MAINNET" : "FLOONET";
  return path.normalize(path.join(remote.app.getPath("home"), ".GrinPP", net));
};

export const getConfigFilePath = function(floonet: boolean = false): string {
  const path = require("path");
  return path.normalize(
    path.join(getNodeDataPath(floonet), "server_config.json")
  );
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
  const path = require("path");
  if (mode === "PROD") {
    return path.normalize(
      path.join(process.resourcesPath, "./app.asar.unpacked/" + nodePath)
    );
  } else {
    return path.normalize(
      path.join(require("electron").remote.app.getAppPath(), nodePath)
    );
  }
};

export const getCommandPath = function(nodePath: string): string {
  const path = require("path");
  return path.normalize(path.join(nodePath, getCommand()));
};

export const runNode = function(
  mode: "DEV" | "TEST" | "PROD",
  nodePath: string,
  isFloonet: boolean = false
): void {
  const params = isFloonet ? ["--headless", "--floonet"] : ["--headless"];
  const absolutePath = getAbsoluteNodePath(mode, nodePath);
  const command = getCommandPath(absolutePath);

  require("electron-log").info(
    "Current working directory: " + require("process").cwd()
  );

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
  let isRunning: boolean = false;
  try {
    isRunning = await retryAsync(
      async () => {
        log.info(`Checking if ${command} is running...`);
        const running = await isProcessRunning(command);
        if (running) {
          log.info(`${command} is running`);
        } else {
          log.info(`${command} is NOT running`);
        }
        return running;
      },
      { delay: 1000, maxTry: retries }
    );
  } catch (error) {
    log.error(`${command} is not running: ${error.message}`);
  }
  return isRunning;
};

export const isTorRunning = async function(
  retries: number = 1
): Promise<boolean> {
  const log = require("electron-log");
  const command = getTorCommand();
  let isRunning: boolean = false;
  try {
    isRunning = await retryAsync(
      async () => {
        log.info(`Checking if ${command} is running...`);
        const running = await isProcessRunning(command);
        if (running) {
          log.info(`${command} is running`);
        } else {
          log.info(`${command} is NOT running`);
        }
        return running;
      },
      { delay: 1000, maxTry: retries }
    );
  } catch (error) {
    log.error(`${command} is not running: ${error.message}`);
  }
  return isRunning;
};

export const stopNode = function(): void {
  try {
    killProcess(getCommand());
  } catch (e) {}
};

export const stopRustNode = function(): void {
  try {
    killProcess(getRustNodeProcess());
  } catch (e) {}
};

export const getDefaultSettings = function(
  file: string = "defaults.json"
): IWalletSettings {
  const fs = require("fs");
  const path = require("path");

  const settingsFilePath = path.normalize(
    path.join(path.normalize(require("electron").remote.app.getAppPath()), file)
  );
  const configFilePath = getConfigFilePath();

  if (!fs.existsSync(settingsFilePath)) {
    throw new Error(`Can't find settings file: ${settingsFilePath}`);
  }

  if (!fs.existsSync(configFilePath)) {
    throw new Error(`Can't find config file: ${configFilePath}`);
  }

  const settingsFileContent = getTextFileContent(settingsFilePath);
  const defaults = JSON.parse(settingsFileContent);

  const configFileContent = getTextFileContent(configFilePath);
  const node = JSON.parse(configFileContent);

  return {
    ip: defaults.ip,
    protocol: defaults.protocol,
    mode: defaults.mode,
    binaryPath: defaults.binaryPath,
    floonet: defaults.floonet,
    minimumPeers: node.P2P.MIN_PEERS,
    maximumPeers: node.P2P.MAX_PEERS,
    minimumConfirmations: node.WALLET.MIN_CONFIRMATIONS,
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
