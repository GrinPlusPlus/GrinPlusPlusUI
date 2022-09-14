import { retryAsync } from "ts-retry";
import { IWalletSettings } from "../../interfaces/IWalletSettings";
import { getTextFileContent } from "../utils";

import { ConfigNode } from "../foreign/rpc";

export const getCommand = function (): string {
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

export const getTorCommand = function (): string {
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

export const getRustNodeProcess = function (): string {
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

const isProcessRunning = function (processName: string): Promise<boolean> {
  const cmd = (() => {
    switch (require("os").platform()) {
      case "win32":
        return `tasklist`;
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
      (err: Error, stdout: string) => {
        if (err) reject(err);
        if (require("electron").remote.process.platform === "win32") {
          resolve(
            stdout.match(new RegExp("\\b" + processName + "\\b", "g")) !== null
          );
        } else {
          resolve(stdout.toLowerCase().indexOf(processName.toLowerCase()) > -1);
        }
      }
    );
  });
};

const killProcess = function (processName: string): void {
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

export const getNodeDataPath = function (floonet: boolean = false): string {
  const { remote } = require("electron");
  const path = require("path");
  const net = !floonet ? "MAINNET" : "FLOONET";
  return path.normalize(path.join(remote.app.getPath("home"), ".GrinPP", net));
};

export const getConfigFilePath = function (floonet: boolean = false): string {
  const path = require("path");
  return path.normalize(
    path.join(getNodeDataPath(floonet), "server_config.json")
  );
};

export const updateSettings = async function (
  min_peers: number,
  max_peers: number,
  min_confirmations: number,
): Promise<{} | null> {
  return await ConfigNode({ min_peers: min_peers, max_peers: max_peers, min_confirmations: min_confirmations });
};

export const getAbsoluteNodePath = function (
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

export const getCommandPath = function (nodePath: string): string {
  const path = require("path");
  return path.normalize(path.join(nodePath, getCommand()));
};

export const runNode = function (
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
  const node = require("child_process").execFile(command, params, {
    windowsHide: true,
    encoding: "utf-8",
    detached: true,
    shell: false,
    cwd: absolutePath,
  });
  require("electron-log").info(`Backend spawned pid: ${node.pid}`);
  node.stdout.on("data", function (data: any) {
    require("electron-log").info(data.toString());
  });
  node.stderr.on("data", function (data: any) {
    require("electron-log").error(data.toString());
  });
  node.on("close", (code: number) => {
    require("electron-log").info(`Backend process exited with code ${code}`);
  });
};

export const isNodeRunning = async function (
  retries: number = 0
): Promise<boolean> {
  const log = require("electron-log");
  const command = getCommand();
  let isRunning: boolean = false;
  try {
    isRunning = await retryAsync(
      async () => {
        return await isProcessRunning(command);
      },
      { delay: 1000, maxTry: retries }
    );
  } catch (error) {
    log.error(`${command} is not running: ${error.message}`);
  }
  return isRunning;
};

export const isTorRunning = async function (
  retries: number = 1
): Promise<boolean> {
  const log = require("electron-log");
  const command = getTorCommand();
  let isRunning: boolean = false;
  try {
    isRunning = await retryAsync(
      async () => {
        return await isProcessRunning(command);
      },
      { delay: 1000, maxTry: retries }
    );
  } catch (error) {
    log.error(`${command} is not running: ${error.message}`);
  }
  return isRunning;
};

export const stopNode = function (): void {
  try {
    killProcess(getCommand());
  } catch (e) {
    require("electron-log").info(`${e.message}`);
  }
};

export const deleteData = function (): void {
  try {
    const fs = require('fs');
    const path = require("path");
    const homedir = require('os').homedir();
    const nodeDir = path.join(path.normalize(homedir), path.normalize("./.GrinPP/MAINNET/NODE"));
    fs.rmdirSync(nodeDir, { recursive: true });
  } catch (e) {
    require("electron-log").error(`${e.message}`);
  }
};

export const stopRustNode = function (): void {
  try {
    killProcess(getRustNodeProcess());
  } catch (e) {
    require("electron-log").info(`${e.message}`);
  }
};

export const getDefaultSettings = async function (
  file: string = "defaults.json"
): Promise<IWalletSettings> {
  const fs = require("fs");
  const path = require("path");

  const settingsFilePath = path.normalize(
    path.join(path.normalize(require("electron").remote.app.getAppPath()), file)
  );

  if (!fs.existsSync(settingsFilePath)) {
    throw new Error(`Can't find settings file: ${settingsFilePath}`);
  }

  const settingsFileContent = getTextFileContent(settingsFilePath);
  const defaults = JSON.parse(settingsFileContent);

  return {
    ip: defaults.ip,
    protocol: defaults.protocol,
    mode: defaults.mode,
    binaryPath: defaults.binaryPath,
    floonet: defaults.floonet,
    minimumPeers: defaults.minimumPeers, // default value
    maximumPeers: defaults.maximumPeers, // default value
    minimumConfirmations: defaults.minimumConfirmations, // default value
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

export const getNodeSettings = async function (): Promise<{
  minimumPeers: number;
  maximumPeers: number;
  minimumConfirmations: number;
  shouldReuseAddresses: boolean;
  preferredPeers: string[];
  allowedPeers: string[];
  blockedPeers: string[];
}> {
  let minimumPeers = 6;
  let maximumPeers = 6;
  let minimumConfirmations = 3;
  let shouldReuseAddresses = true;
  let preferredPeers: string[] = [];
  let allowedPeers: string[] = [];
  let blockedPeers: string[] = [];

  const node = await ConfigNode();
  if (node !== null) {
    minimumPeers = node.min_peers;
    maximumPeers = node.max_peers;
    minimumConfirmations = node.min_confirmations;
    shouldReuseAddresses = node.reuse_address;
    preferredPeers = node.preferred_peers;
    allowedPeers = node.allowed_peers;
    blockedPeers = node.blocked_peers;
  }

  return {
    minimumPeers: minimumPeers,
    maximumPeers: maximumPeers,
    minimumConfirmations: minimumConfirmations,
    shouldReuseAddresses: shouldReuseAddresses,
    preferredPeers: preferredPeers ? preferredPeers : [],
    allowedPeers: allowedPeers ? allowedPeers : [],
    blockedPeers: blockedPeers ? blockedPeers : [],
  };
};

export const verifyNodePath = function (
  mode: "DEV" | "TEST" | "PROD",
  defaultPath: string
): boolean {
  defaultPath = getCommandPath(getAbsoluteNodePath(mode, defaultPath));
  require("electron-log").info(`Node Location: ${defaultPath}`);
  return require("fs").existsSync(defaultPath);
};
