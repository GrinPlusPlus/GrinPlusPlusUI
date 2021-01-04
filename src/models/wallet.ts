import { Action, Thunk, action, thunk } from "easy-peasy";

import { Injections } from "../store";
import { StoreModel } from ".";

export interface WalletModel {
  isNodeInstalled: boolean;
  isNodeRunning: boolean;
  isTorRunning: boolean;
  isWalletInitialized: boolean;
  message: string;
  logs: string;
  initializingError: boolean;
  setIsNodeInstalled: Action<WalletModel, boolean>;
  setIsNodeRunning: Action<WalletModel, boolean>;
  setIsTorRunning: Action<WalletModel, boolean>;
  setWalletInitialized: Action<WalletModel, boolean>;
  setInitializingError: Action<WalletModel, boolean>;
  setMessage: Action<WalletModel, string>;
  restartNode: Thunk<WalletModel, undefined, Injections, StoreModel>;
  checkNodeHealth: Thunk<WalletModel, undefined, Injections, StoreModel>;
  reSyncBlockchain: Thunk<WalletModel, undefined, Injections, StoreModel>;
  initializeWallet: Thunk<WalletModel, undefined, Injections, StoreModel>;
  replaceLogs: Action<WalletModel, string>;
  updateLogs: Action<WalletModel, string>;
  nodeHealthCheck: boolean;
  setNodeHealthCheck: Action<WalletModel, boolean>;
}

const wallet: WalletModel = {
  isNodeInstalled: false,
  isNodeRunning: false,
  isTorRunning: false,
  isWalletInitialized: false,
  nodeHealthCheck: false,
  initializingError: false,
  message: "initializing_node",
  logs: "",
  setIsNodeInstalled: action((state, payload) => {
    state.isNodeInstalled = payload;
  }),
  setIsNodeRunning: action((state, isRunning) => {
    state.isNodeRunning = isRunning;
  }),
  setIsTorRunning: action((state, isRunning) => {
    state.isTorRunning = isRunning;
  }),
  setInitializingError: action((state, error) => {
    state.initializingError = error;
  }),
  setWalletInitialized: action((state, payload) => {
    state.isWalletInitialized = payload;
  }),
  setMessage: action((state, payload) => {
    state.message = payload;
  }),
  replaceLogs: action((state, logs) => {
    state.logs = logs;
  }),
  updateLogs: action((state, payload) => {
    state.logs = `${
      state.logs
    }[${new Date().toLocaleTimeString()}] ${payload}\n`;
  }),
  restartNode: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState, getStoreActions }
    ) => {
      const { nodeService } = injections;
      const settings = getStoreState().settings.defaultSettings;

      if (nodeService.isNodeRunning(0)) {
        try {
          new nodeService.REST(
            settings.floonet,
            settings.protocol,
            settings.ip
          ).shutdownNode();
        } catch (error) {
          nodeService.stopNode();
        }
      }
      getStoreActions().session.clean();
    }
  ),
  reSyncBlockchain: thunk(
    async (actions, payload, { injections, getStoreState }) => {
      const { nodeService } = injections;
      const defaultSettings = getStoreState().settings.defaultSettings;
      return await new nodeService.REST(
        defaultSettings.floonet,
        defaultSettings.protocol,
        defaultSettings.ip
      ).resyncNode();
    }
  ),
  initializeWallet: thunk(
    async (
      actions,
      payload,
      { injections, getStoreActions }
    ): Promise<boolean> => {
      const { nodeService, utilsService } = injections;
      const defaultSettings = nodeService.getDefaultSettings(); // Read defaults.json

      nodeService.stopRustNode();

      // Check if we can find the node...
      if (
        !nodeService.verifyNodePath(
          defaultSettings.mode,
          defaultSettings.binaryPath
        )
      ) {
        actions.setInitializingError(true);
        actions.setWalletInitialized(false);
        actions.setNodeHealthCheck(false);
        actions.setMessage("node_is_not_installed");
        return false;
      }

      // if the Node is running we should stop it
      if (await nodeService.isNodeRunning(1)) {
        nodeService.stopNode();
      }

      try {
        require("electron-log").info("Running Node...");
        nodeService.runNode(
          defaultSettings.mode,
          defaultSettings.binaryPath,
          defaultSettings.floonet
        );
      } catch (error) {
        require("electron-log").error(`Error running Node: ${error.message}`);
      }

      // Let's double check if the Node is running...
      if (!(await nodeService.isNodeRunning(10))) {
        actions.setInitializingError(true);
        actions.setWalletInitialized(false);
        actions.setNodeHealthCheck(false);
        actions.setMessage("node_is_not_running");
        return false;
      }

      actions.setIsNodeInstalled(true);
      actions.setIsNodeRunning(true);

      const settingsActions = getStoreActions().settings;
      settingsActions.setDefaultSettings(defaultSettings); // Update state
      settingsActions.setNodeBinaryPath(
        `${nodeService.getCommandPath(defaultSettings.binaryPath)}`
      );
      settingsActions.setNodeDataPath(
        nodeService.getNodeDataPath(defaultSettings.floonet)
      );
      settingsActions.setGrinJoinAddress(defaultSettings.grinJoinAddress);
      settingsActions.setGrinChckAddress(defaultSettings.grinChckAddress);
      // Updating store with server_config.json
      settingsActions.setMaximumPeers(defaultSettings.maximumPeers);
      settingsActions.setMininumPeers(defaultSettings.minimumPeers);
      settingsActions.setConfirmations(defaultSettings.minimumConfirmations);

      getStoreActions().receiveCoinsModel.setResponsesDestination(
        utilsService.getHomePath()
      );
      actions.setInitializingError(false);
      actions.setWalletInitialized(true);
      actions.setNodeHealthCheck(true);
      actions.setMessage("");

      return true;
    }
  ),
  setNodeHealthCheck: action((state, check) => {
    state.nodeHealthCheck = check;
  }),
  checkNodeHealth: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState, getStoreActions }
    ): Promise<boolean> => {
      const { nodeService } = injections;
      actions.setIsTorRunning(await nodeService.isTorRunning(1));
      if (!(await nodeService.isNodeRunning(10))) {
        actions.setInitializingError(true);
        actions.setWalletInitialized(false);
        actions.setNodeHealthCheck(false);
        actions.setMessage("node_is_not_running");
        return false;
      }
      actions.setInitializingError(false);
      actions.setWalletInitialized(true);
      actions.setNodeHealthCheck(true);
      actions.setMessage("");
      return true;
    }
  ),
};

export default wallet;
