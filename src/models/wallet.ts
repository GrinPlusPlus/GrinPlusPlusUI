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
  action: "backup" | "delete" | undefined;
  setAction: Action<WalletModel, "backup" | "delete" | undefined>;
  setIsNodeInstalled: Action<WalletModel, boolean>;
  setIsNodeRunning: Action<WalletModel, boolean>;
  setIsTorRunning: Action<WalletModel, boolean>;
  setWalletInitialized: Action<WalletModel, boolean>;
  setInitializingError: Action<WalletModel, boolean>;
  setMessage: Action<WalletModel, string>;
  restartNode: Thunk<WalletModel, undefined, Injections, StoreModel>;
  checkNodeHealth: Thunk<WalletModel, undefined, Injections, StoreModel>;
  reSyncBlockchain: Thunk<WalletModel, undefined, Injections, StoreModel>;
  scanForOutputs: Thunk<WalletModel, undefined, Injections, StoreModel>;
  initializeWallet: Thunk<WalletModel, undefined, Injections, StoreModel>;
  getWalletSeed: Thunk<
    WalletModel,
    {
      username: string;
      password: string;
    },
    Injections,
    StoreModel
  >;
  deleteWallet: Thunk<
    WalletModel,
    {
      username: string;
      password: string;
    },
    Injections,
    StoreModel
  >;
  replaceLogs: Action<WalletModel, string>;
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
  action: undefined,
  setAction: action((state, payload) => {
    state.action = payload;
  }),
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
  restartNode: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState, getStoreActions }
    ) => {
      const { nodeService } = injections;
      const settings = getStoreState().settings.defaultSettings;

      if (await nodeService.isNodeRunning(1)) {
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
    async (actions, payload, { injections, getStoreState, getStoreActions }) => {
      const { nodeService } = injections;
      getStoreActions().session.clean();
      nodeService.stopNode();
      nodeService.deleteData();
      getStoreActions().wallet.initializeWallet();
    }
  ),
  scanForOutputs: thunk(
    async (actions, payload, { injections, getStoreState }) => {
      const { ownerService } = injections;
      const defaultSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.RPC(
        defaultSettings.floonet,
        defaultSettings.protocol,
        defaultSettings.ip
      ).scanOutputs(getStoreState().session.token);
    }
  ),
  getWalletSeed: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ): Promise<string[]> => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      )
        .getSeed(payload.username, payload.password)
        .then((response) => {
          return response;
        });
    }
  ),
  deleteWallet: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ): Promise<boolean> => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      )
        .deleteWallet(payload.username, payload.password)
        .then((response) => {
          return response;
        });
    }
  ),

  initializeWallet: thunk(
    async (
      actions,
      payload,
      { injections, getStoreActions }
    ): Promise<boolean> => {
      const { nodeService } = injections;

      const defaultSettings = await nodeService.getDefaultSettings();

      nodeService.stopRustNode();

      // Check if we can find the node...
      try {
        if (
          !nodeService.verifyNodePath(
            defaultSettings.mode,
            defaultSettings.binaryPath
          )
        ) {
          throw new Error(`Can't find path: ${defaultSettings.binaryPath}`);
        }
      } catch (error) {
        require("electron-log").error(`Error running Node: ${error.message}`);
        actions.setIsNodeInstalled(false);
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
        nodeService.runNode(
          defaultSettings.mode,
          require("path").normalize(defaultSettings.binaryPath),
          defaultSettings.floonet
        );
      } catch (error) {
        require("electron-log").error(`Error running Node: ${error.message}`);

        actions.setIsNodeInstalled(false);
        actions.setInitializingError(true);
        actions.setWalletInitialized(false);
        actions.setNodeHealthCheck(false);
        actions.setMessage("node_is_not_running");
        return false;
      }

      // Let's double check if the Node is running...
      if (!(await nodeService.isNodeRunning(30))) {
        actions.setIsNodeInstalled(false);
        actions.setInitializingError(true);
        actions.setWalletInitialized(false);
        actions.setNodeHealthCheck(false);
        actions.setMessage("node_is_not_running");
        return false;
      }

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

      actions.setIsNodeInstalled(true);
      actions.setIsNodeRunning(true);
      actions.setWalletInitialized(true);
      actions.setNodeHealthCheck(true);
      actions.setInitializingError(false);
      actions.setMessage("");

      return true;
    }
  ),
  setNodeHealthCheck: action((state, check) => {
    state.nodeHealthCheck = check;
  }),
  checkNodeHealth: thunk(
    async (actions, payload, { injections }): Promise<boolean> => {
      const { nodeService } = injections;

      actions.setIsTorRunning(await nodeService.isTorRunning(1));

      const isNodeRunning = await nodeService.isNodeRunning(1);

      actions.setNodeHealthCheck(isNodeRunning);
      actions.setMessage(isNodeRunning ? "" : "node_is_not_running");

      return isNodeRunning;
    }
  ),
};

export default wallet;
