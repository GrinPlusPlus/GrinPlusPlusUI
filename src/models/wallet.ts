import { Action, Thunk, action, thunk } from "easy-peasy";

import { Injections } from "../store";
import { StoreModel } from ".";

export interface WalletModel {
  isNodeInstalled: boolean;
  isNodeRunning: boolean;
  isWalletInitialized: boolean;
  message: string;
  logs: string;
  initializingError: boolean;
  setIsNodeInstalled: Action<WalletModel, boolean>;
  setIsNodeRunning: Action<WalletModel, boolean>;
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
  isWalletInitialized: false,
  message: "initializing_node",
  logs: "",
  initializingError: false,
  setIsNodeInstalled: action((state, payload) => {
    state.isNodeInstalled = payload;
  }),
  setIsNodeRunning: action((state, isRunning) => {
    state.isNodeRunning = isRunning;
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
    (actions, payload, { injections, getStoreActions }): Promise<boolean> => {
      const { nodeService, utilsService } = injections;
      return new Promise((resolve, reject) => {
        try {
          const defaultSettings = nodeService.getDefaultSettings(); // Read defaults.json

          const settingsActions = getStoreActions().settings;
          settingsActions.setDefaultSettings(defaultSettings); // Update state

          // Check if we can find the node...
          const isInstalled = nodeService.verifyNodePath(
            defaultSettings.mode,
            defaultSettings.binaryPath
          );

          actions.setIsNodeInstalled(isInstalled);

          if (!isInstalled) reject("node_is_not_installed");

          // if the node is running we should stop it
          if (nodeService.isNodeRunning(0)) {
            nodeService.stopNode();
          }
          nodeService.runNode(
            defaultSettings.mode,
            defaultSettings.binaryPath,
            defaultSettings.floonet
          );

          // Let's double check if the Node is running...
          const isRunning = nodeService.isNodeRunning(10);
          if (!isRunning) reject("node_is_not_running");
          actions.setIsNodeRunning(isRunning);

          settingsActions.setNodeBinaryPath(
            `${nodeService.getCommandPath(defaultSettings.binaryPath)}`
          );
          settingsActions.setNodeDataPath(
            nodeService.getNodeDataPath(defaultSettings.floonet)
          );
          settingsActions.setGrinJoinAddress(defaultSettings.grinJoinAddress);
          // Updating store with server_config.json
          settingsActions.setMaximumPeers(defaultSettings.maximumPeers);
          settingsActions.setMininumPeers(defaultSettings.minimumPeers);
          settingsActions.setConfirmations(
            defaultSettings.minimumConfirmations
          );

          actions.setMessage("");

          actions.setInitializingError(false);
          actions.setWalletInitialized(true);
          getStoreActions().receiveCoinsModel.setResponsesDestination(
            utilsService.getHomePath()
          );

          actions.setNodeHealthCheck(true);
        } catch (ex) {
          reject(ex.toString());
        }
        resolve(true);
      });
    }
  ),
  nodeHealthCheck: true,
  setNodeHealthCheck: action((state, check) => {
    state.nodeHealthCheck = check;
  }),
  checkNodeHealth: thunk(
    (
      actions,
      payload,
      { injections, getStoreState, getStoreActions }
    ): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const { nodeService, utilsService } = injections;

        const defaultSettings = nodeService.getDefaultSettings(); // Read defaults.json

        const settingsActions = getStoreActions().settings;
        settingsActions.setDefaultSettings(defaultSettings); // Update state

        // Check if we can find the node...
        const isInstalled = nodeService.verifyNodePath(
          defaultSettings.mode,
          defaultSettings.binaryPath
        );

        actions.setIsNodeInstalled(isInstalled);

        if (!isInstalled) reject("node_is_not_installed");

        // Let's double check if the Node is running...
        const isRunning = nodeService.isNodeRunning(0);
        actions.setIsNodeRunning(isRunning);

        if (!isRunning) {
          actions.setWalletInitialized(false);
          actions.setNodeHealthCheck(false);
          reject("node_is_not_running");
        }

        settingsActions.setNodeBinaryPath(
          `${nodeService.getCommandPath(defaultSettings.binaryPath)}`
        );
        settingsActions.setNodeDataPath(
          nodeService.getNodeDataPath(defaultSettings.floonet)
        );
        settingsActions.setGrinJoinAddress(defaultSettings.grinJoinAddress);
        // Updating store with server_config.json
        settingsActions.setMaximumPeers(defaultSettings.maximumPeers);
        settingsActions.setMininumPeers(defaultSettings.minimumPeers);
        settingsActions.setConfirmations(defaultSettings.minimumConfirmations);

        actions.setMessage("");

        if (!getStoreState().receiveCoinsModel.responsesDestination) {
          getStoreActions().receiveCoinsModel.setResponsesDestination(
            utilsService.getHomePath()
          );
        }
        resolve(true);
      });
    }
  ),
};

export default wallet;
