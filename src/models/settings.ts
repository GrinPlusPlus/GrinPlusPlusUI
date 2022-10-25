import { Action, Thunk, ThunkOn, action, thunk, thunkOn } from "easy-peasy";

import store, { Injections } from "../store";
import { StoreModel } from ".";

export interface SettingsModel {
  defaultSettings: {
    floonet: boolean;
    protocol: string;
    ip: string;
    mode: "DEV" | "TEST" | "PROD";
  };
  mininumPeers: number;
  maximumPeers: number;
  confirmations: number;
  shouldReuseAddress: boolean;
  preferredPeers: string[];
  allowedPeers: string[];
  blockedPeers: string[];
  nodeDataPath: string;
  nodeBinaryPath: string;
  useGrinJoin: boolean;
  grinJoinAddress: string;
  grinChckAddress: string;
  isConfirmationDialogOpen: boolean;
  isTorBridgesFeaturesEnabled: boolean;
  snowflakeBridges: string[];
  obfs4Bridges: string[];
  obfs4BridgesFromDialog: string;
  isObfs4BridgesDialogOpen: boolean;
  setDefaultSettings: Action<
    SettingsModel,
    {
      floonet: boolean;
      protocol: string;
      ip: string;
      mode: "DEV" | "TEST" | "PROD";
    }
  >;
  setNodeDataPath: Action<SettingsModel, string>;
  setNodeBinaryPath: Action<SettingsModel, string>;
  setMininumPeers: Action<SettingsModel, number>;
  setMaximumPeers: Action<SettingsModel, number>;
  setConfirmations: Action<SettingsModel, number>;
  setGrinJoinUse: Action<SettingsModel, boolean>;
  setGrinJoinAddress: Action<SettingsModel, string>;
  setGrinChckAddress: Action<SettingsModel, string>;
  toggleConfirmationDialog: Action<SettingsModel>;
  toggleObfs4BridgesDialog: Action<SettingsModel>;
  onSettingsChanged: ThunkOn<SettingsModel, Injections, StoreModel>;
  getNodeSettings: Thunk<SettingsModel, undefined, Injections, StoreModel>;
  setNodeSettings: Action<
    SettingsModel,
    {
      mininumPeers: number;
      maximumPeers: number;
      minimumConfirmations: number;
      shouldReuseAddress: boolean;
      preferredPeers: string[];
      allowedPeers: string[];
      blockedPeers: string[];
    }
  >;
  setPreferredPeers: Action<SettingsModel, string>;
  setAllowedPeers: Action<SettingsModel, string>;
  setBlockedPeers: Action<SettingsModel, string>;
  updatePeferredPeers: Thunk<SettingsModel, undefined, Injections, StoreModel>;
  getTorSettings: Thunk<SettingsModel, undefined, Injections, StoreModel>;
  setSnowflakeBridges: Action<SettingsModel, string[]>;
  setObfs4Bridges: Action<SettingsModel, string[]>;
  setObfs4BridgesFromDialog: Action<SettingsModel, string>;
  setIsTorBridgesFeaturesEnabled: Action<SettingsModel, boolean>;
  setIfShouldReuseAddress: Action<SettingsModel, boolean>;
  enableSnowflakeTorBridges: Thunk<SettingsModel, boolean, Injections, StoreModel>;
  enableObfs4TorBridges: Thunk<SettingsModel, string, Injections, StoreModel>;
  enableAddressReuse: Thunk<SettingsModel, boolean, Injections, StoreModel>;
  disableObfs4BridgesDialog: Thunk<SettingsModel, undefined, Injections, StoreModel>;
}

const settings: SettingsModel = {
  defaultSettings: {
    floonet: false,
    protocol: "http",
    ip: "127.0.0.1",
    mode: "DEV",
  },
  mininumPeers: 6,
  maximumPeers: 6,
  confirmations: 3,
  shouldReuseAddress: false,
  preferredPeers: [],
  allowedPeers: [],
  blockedPeers: [],
  nodeDataPath: "/.GrinPP/",
  nodeBinaryPath: "../GrinPlusPlus/bin/Release/",
  useGrinJoin: false,
  grinJoinAddress: "grinjoin5pzzisnne3naxx4w2knwxsyamqmzfnzywnzdk7ra766u7vid",
  grinChckAddress: "http://192.227.214.130/",
  isConfirmationDialogOpen: false,
  isTorBridgesFeaturesEnabled: false,
  snowflakeBridges: [],
  obfs4Bridges: [],
  obfs4BridgesFromDialog: "",
  isObfs4BridgesDialogOpen: false,
  setDefaultSettings: action((state, settings) => {
    state.defaultSettings = {
      floonet: settings.floonet,
      protocol: settings.protocol,
      ip: settings.ip,
      mode: settings.mode,
    };
  }),
  setMininumPeers: action((state, value) => {
    const diff = value - state.mininumPeers;
    state.maximumPeers += state.maximumPeers + diff > 0 ? diff : 0;
    state.mininumPeers = value;
  }),
  setMaximumPeers: action((state, value) => {
    state.maximumPeers = state.mininumPeers + value;
  }),
  setConfirmations: action((state, confirmations) => {
    state.confirmations = confirmations;
  }),
  setNodeDataPath: action((state, payload) => {
    state.nodeDataPath = payload;
  }),
  setNodeBinaryPath: action((state, payload) => {
    state.nodeBinaryPath = payload;
  }),
  setGrinJoinUse: action((state, payload) => {
    state.useGrinJoin = payload;
  }),
  setGrinJoinAddress: action((state, payload) => {
    state.grinJoinAddress = payload;
  }),
  setGrinChckAddress: action((state, payload) => {
    state.grinChckAddress = payload;
  }),
  setSnowflakeBridges: action((state, bridges) => {
    state.snowflakeBridges = bridges;
  }),
  setObfs4Bridges: action((state, bridges) => {
    state.obfs4Bridges = bridges;
  }),
  setObfs4BridgesFromDialog: action((state, payload) => {
    state.obfs4BridgesFromDialog = payload;
  }),
  setIsTorBridgesFeaturesEnabled: action((state, status) => {
    state.isTorBridgesFeaturesEnabled = status;
  }),
  toggleConfirmationDialog: action((state) => {
    state.isConfirmationDialogOpen = !state.isConfirmationDialogOpen;
  }),
  toggleObfs4BridgesDialog: action((state) => {
    state.isObfs4BridgesDialogOpen = !state.isObfs4BridgesDialogOpen;
  }),
  onSettingsChanged: thunkOn(
    (actions, storeActions) => [
      storeActions.settings.setMininumPeers,
      storeActions.settings.setMaximumPeers,
      storeActions.settings.setConfirmations,
    ],
    (actions, target, { injections }) => {
      injections.nodeService.updateNodeSettings(store.getState().settings.mininumPeers,
        store.getState().settings.maximumPeers,
        store.getState().settings.confirmations);
    }
  ),
  getNodeSettings: thunk(
    async (actions, payload, { injections }): Promise<boolean> => {
      const { nodeService } = injections;

      const settings = await nodeService.getNodeSettings();

      actions.setNodeSettings({
        mininumPeers: settings.minimumPeers,
        maximumPeers: settings.maximumPeers,
        minimumConfirmations: settings.minimumConfirmations,
        shouldReuseAddress: settings.shouldReuseAddresses,
        preferredPeers: settings.preferredPeers,
        allowedPeers: settings.allowedPeers,
        blockedPeers: settings.blockedPeers,
      });

      return true;
    }
  ),
  setNodeSettings: action((state, settings) => {
    state.mininumPeers = settings.mininumPeers;
    state.maximumPeers = settings.maximumPeers;
    state.confirmations = settings.minimumConfirmations;
    state.shouldReuseAddress = settings.shouldReuseAddress;
    state.preferredPeers = settings.preferredPeers;
    state.allowedPeers = settings.allowedPeers;
    state.blockedPeers = settings.blockedPeers;
  }),
  setPreferredPeers: action((state, peers) => {
    state.preferredPeers = peers.trim().replace(/\r?\n|\r/g, ",").split(",");
  }),
  setAllowedPeers: action((state, peers) => {
    state.allowedPeers = peers.trim().replace(/\r?\n|\r/g, ",").split(",");
  }),
  setBlockedPeers: action((state, peers) => {
    state.blockedPeers = peers.trim().replace(/\r?\n|\r/g, ",").split(",");
  }),
  setIfShouldReuseAddress: action((state, resuseAddress) => {
    state.shouldReuseAddress = resuseAddress;
  }),
  updatePeferredPeers: thunk(
    async (actions, payload, { injections, getStoreState }): Promise<boolean> => {
      const { nodeService } = injections;
      const settings = getStoreState().settings;
      await nodeService.updatePeersSettings(settings.preferredPeers, settings.allowedPeers, settings.blockedPeers);
      return true;
    }
  ),
  getTorSettings: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      const torSettings = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).getTorSettings();
      actions.setSnowflakeBridges([]);
      actions.setObfs4Bridges([]);
      actions.setIsTorBridgesFeaturesEnabled(false);
      if (torSettings.bridges.length > 0) {
        if (torSettings.bridges_type === "obfs4") actions.setObfs4Bridges(torSettings.bridges);
        else {
          actions.setSnowflakeBridges(torSettings.bridges);
          actions.setIsTorBridgesFeaturesEnabled(true);
        }
      }
    }
  ),
  enableSnowflakeTorBridges: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      const torSettings = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).updateTorSettings([], payload);
      actions.setIsTorBridgesFeaturesEnabled(payload);
      actions.setSnowflakeBridges([]);
      actions.setObfs4Bridges([]);
      if (torSettings.bridges.length > 0) {
        actions.setIsTorBridgesFeaturesEnabled(true);
        if (torSettings.bridges_type === "obfs4") {
          actions.setObfs4Bridges(torSettings.bridges);
        }
        else {
          actions.setSnowflakeBridges(torSettings.bridges);
        }
      } else {
        actions.setIsTorBridgesFeaturesEnabled(false);
      }
    }
  ),
  enableAddressReuse: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ) => {
      const { nodeService } = injections;
      await nodeService.setIfShouldReuseAddress(payload);
      actions.setIfShouldReuseAddress(payload);
    }
  ),
  enableObfs4TorBridges: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      const torSettings = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).updateTorSettings(payload.split("\n"), false);
      actions.setIsTorBridgesFeaturesEnabled(false);
      actions.setSnowflakeBridges([]);
      actions.setObfs4Bridges([]);
      if (torSettings.bridges.length > 0) {
        if (torSettings.bridges_type === "obfs4") {
          actions.setObfs4Bridges(torSettings.bridges);
        }
        else {
          actions.setSnowflakeBridges(torSettings.bridges);
        }
      }
    }
  ),
  disableObfs4BridgesDialog: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      const torSettings = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).updateTorSettings([], false);
      actions.setIsTorBridgesFeaturesEnabled(false);
      actions.setSnowflakeBridges([]);
      actions.setObfs4Bridges([]);
      if (torSettings.bridges.length > 0) {
        if (torSettings.bridges_type === "obfs4") {
          actions.setObfs4Bridges(torSettings.bridges);
        }
        else {
          actions.setSnowflakeBridges(torSettings.bridges);
        }
      }
    }
  )
};

export default settings;
