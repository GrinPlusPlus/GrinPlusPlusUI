import { Action, Thunk, ThunkOn, action, thunk, thunkOn } from "easy-peasy";

import { Injections } from "../store";
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
  nodeDataPath: string;
  nodeBinaryPath: string;
  useGrinJoin: boolean;
  grinJoinAddress: string;
  grinChckAddress: string;
  isConfirmationDialogOpen: boolean;
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
  onSettingsChanged: ThunkOn<SettingsModel, Injections, StoreModel>;
  getNodeSettings: Thunk<SettingsModel, undefined, Injections, StoreModel>;
  setNodeSettings: Action<
    SettingsModel,
    {
      mininumPeers: number;
      maximumPeers: number;
      minimumConfirmations: number;
    }
  >;
}

const settings: SettingsModel = {
  defaultSettings: {
    floonet: false,
    protocol: "http",
    ip: "127.0.0.1",
    mode: "DEV",
  },
  mininumPeers: 15,
  maximumPeers: 50,
  confirmations: 10,
  nodeDataPath: "/.GrinPP/",
  nodeBinaryPath: "../GrinPlusPlus/bin/Release/",
  useGrinJoin: false,
  grinJoinAddress: "grinjoin5pzzisnne3naxx4w2knwxsyamqmzfnzywnzdk7ra766u7vid",
  grinChckAddress: "http://192.227.214.130/",
  isConfirmationDialogOpen: false,
  setDefaultSettings: action((state, settings) => {
    state.defaultSettings = {
      floonet: settings.floonet,
      protocol: settings.protocol,
      ip: settings.ip,
      mode: settings.mode,
    };
  }),
  setMininumPeers: action((state, mininumPeers) => {
    state.mininumPeers = mininumPeers;
  }),
  setMaximumPeers: action((state, maximumPeers) => {
    state.maximumPeers = maximumPeers;
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
  toggleConfirmationDialog: action((state) => {
    state.isConfirmationDialogOpen = !state.isConfirmationDialogOpen;
  }),
  onSettingsChanged: thunkOn(
    (actions, storeActions) => [
      storeActions.settings.setMininumPeers,
      storeActions.settings.setMaximumPeers,
      storeActions.settings.setConfirmations,
    ],
    (actions, target, { injections }) => {
      const [
        setMininumPeers,
        setMaximumPeers,
        setConfirmations,
      ] = target.resolvedTargets;

      switch (target.type) {
        case setMininumPeers:
          injections.nodeService.updateSettings("min_peers", target.payload);
          break;
        case setMaximumPeers:
          injections.nodeService.updateSettings("max_peers", target.payload);
          break;
        case setConfirmations:
          injections.nodeService.updateSettings(
            "min_confirmations",
            target.payload
          );
          break;
      }
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
      });

      return true;
    }
  ),
  setNodeSettings: action((state, settings) => {
    state.mininumPeers = settings.mininumPeers;
    state.maximumPeers = settings.maximumPeers;
    state.confirmations = settings.minimumConfirmations;
  }),
};

export default settings;
