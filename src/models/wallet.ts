import { Action, action, Thunk, thunk } from "easy-peasy";
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
  message: "Initializing node...",
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
      const { nodeService, ownerService } = injections;
      const settings = getStoreState().settings.defaultSettings;

      if (
        new nodeService.REST(
          settings.floonet,
          settings.protocol,
          settings.ip,
          settings.mode
        ).shutdownNode()
      ) {
        setTimeout({}, 3000);
      } else {
        if (nodeService.isNodeRunning()) {
          nodeService.stopNode();
        }
      }

      nodeService.runNode(settings.binaryPath, settings.floonet);
      actions.setIsNodeRunning(nodeService.isNodeRunning());

      const token = getStoreState().session.token;
      if (token) {
        await new ownerService.REST(
          settings.floonet,
          settings.protocol,
          settings.ip,
          settings.mode
        )
          .logout(token)
          .then((response) => {
            getStoreActions().session.updateSession({
              username: "",
              token: "",
              address: "",
            });
          });
      }
    }
  ),
  reSyncBlockchain: thunk(
    async (actions, payload, { injections, getStoreState }) => {
      const { nodeService } = injections;
      const defaultSettings = getStoreState().settings.defaultSettings;
      return await new nodeService.REST(
        defaultSettings.floonet,
        defaultSettings.protocol,
        defaultSettings.ip,
        defaultSettings.mode
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
            defaultSettings.binaryPath
          );

          actions.setIsNodeInstalled(isInstalled);

          if (!isInstalled) reject("Node isn't installed.");

          // if the node is running we should stop it
          if (nodeService.isNodeRunning()) {
            nodeService.stopNode();
          }
          nodeService.runNode(
            defaultSettings.binaryPath,
            defaultSettings.floonet
          );

          // Let's double check if the Node is running...
          const isRunning = nodeService.isNodeRunning();
          if (!isRunning) reject("Node isn't running.");
          actions.setIsNodeRunning(isRunning);

          settingsActions.setNodeBinaryPath(
            `${nodeService.getCommandPath(defaultSettings.binaryPath)}`
          );
          settingsActions.setNodeDataPath(
            nodeService.getNodeDataPath(defaultSettings.floonet)
          );
          settingsActions.setGrinJoinAddress(defaultSettings.grinJoinAddress);

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
  nodeHealthCheck: false,
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

        // Let's double check if the Node is running...
        const isRunning = nodeService.isNodeRunning();
        actions.setIsNodeRunning(isRunning);

        if (!isRunning) {
          actions.setNodeHealthCheck(false);
          reject("Node isn't running.");
        }

        settingsActions.setNodeBinaryPath(
          `${nodeService.getCommandPath(defaultSettings.binaryPath)}`
        );
        settingsActions.setNodeDataPath(
          nodeService.getNodeDataPath(defaultSettings.floonet)
        );
        settingsActions.setGrinJoinAddress(defaultSettings.grinJoinAddress);
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
