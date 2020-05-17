import { action, Action, ThunkOn, thunkOn } from "easy-peasy";
import { Injections } from "../store";
import { StoreModel } from ".";

interface IWalletSettings {
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
}
export interface SettingsModel {
  defaultSettings: IWalletSettings;
  mininumPeers: number;
  maximumPeers: number;
  confirmations: number;
  nodeDataPath: string;
  nodeBinaryPath: string;
  useGrinJoin: boolean;
  grinJoinAddress: string;
  isConfirmationDialogOpen: boolean;
  setDefaultSettings: Action<SettingsModel, IWalletSettings>;
  setNodeDataPath: Action<SettingsModel, string>;
  setNodeBinaryPath: Action<SettingsModel, string>;
  setMininumPeers: Action<SettingsModel, number>;
  setMaximumPeers: Action<SettingsModel, number>;
  setConfirmations: Action<SettingsModel, number>;
  setGrinJoinUse: Action<SettingsModel, boolean>;
  setGrinJoinAddress: Action<SettingsModel, string>;
  toggleConfirmationDialog: Action<SettingsModel>;
  onSettingsChanged: ThunkOn<SettingsModel, Injections, StoreModel>;
}

const settings: SettingsModel = {
  defaultSettings: {
    ip: "127.0.0.1",
    protocol: "http",
    mode: "DEV",
    binaryPath: ".\\GrinPlusPlus\\bin\\RelWithDebInfo",
    floonet: false,
    minimumPeers: 15,
    maximumPeers: 50,
    minimumConfirmations: 10,
    ports: {
      node: 3413,
      foreignRPC: 3415,
      owner: 3420,
      ownerRPC: 3421
    },
    grinJoinAddress: "grinjoin5pzzisnne3naxx4w2knwxsyamqmzfnzywnzdk7ra766u7vid"
  },
  mininumPeers: 15,
  maximumPeers: 50,
  confirmations: 10,
  nodeDataPath: "/.GrinPP/",
  nodeBinaryPath: "./bin/",
  useGrinJoin: false,
  grinJoinAddress: "grinjoin5pzzisnne3naxx4w2knwxsyamqmzfnzywnzdk7ra766u7vid",
  isConfirmationDialogOpen: false,
  setDefaultSettings: action((state, settings) => {
    state.defaultSettings = settings;
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
  toggleConfirmationDialog: action(state => {
    state.isConfirmationDialogOpen = !state.isConfirmationDialogOpen;
  }),
  onSettingsChanged: thunkOn(
    (actions, storeActions) => [
      storeActions.settings.setMininumPeers,
      storeActions.settings.setMaximumPeers,
      storeActions.settings.setConfirmations
    ],
    (actions, target, { injections }) => {
      const configFile = injections.nodeService.getConfigFilePath();
      let property:
        | "MIN_PEERS"
        | "MAX_PEERS"
        | "MIN_CONFIRMATIONS"
        | undefined = undefined;
      const [
        setMininumPeers,
        setMaximumPeers,
        setConfirmations
      ] = target.resolvedTargets;
      switch (target.type) {
        case setMininumPeers:
          property = "MIN_PEERS";
          break;
        case setMaximumPeers:
          property = "MAX_PEERS";
          break;
        case setConfirmations:
          property = "MIN_CONFIRMATIONS";
          break;
      }
      injections.nodeService.updateSettings(
        configFile,
        property,
        target.payload
      );
    }
  )
};

export default settings;
