import { Action, action } from "easy-peasy";

export interface UIModel {
  showNodeSettings: boolean;
  showP2PSettings: boolean;
  showTorSettings: boolean;
  transactionOpened: number;
  alert: string | undefined;
  toggleNodeSettings: Action<UIModel, boolean>;
  toggleP2PSettings: Action<UIModel, boolean>;
  toggleTorSettings: Action<UIModel, boolean>;
  openTransaction: Action<UIModel, number>;
  setAlert: Action<UIModel, string | undefined>;
}

const ui: UIModel = {
  showNodeSettings: false,
  showP2PSettings: false,
  showTorSettings: false,
  transactionOpened: -1,
  alert: undefined,
  toggleNodeSettings: action((state, value) => {
    state.showNodeSettings = value;
  }),
  toggleP2PSettings: action((state, value) => {
    state.showP2PSettings = value;
  }),
  toggleTorSettings: action((state, value) => {
    state.showTorSettings = value;
  }),
  openTransaction: action((state, id) => {
    state.transactionOpened = state.transactionOpened === id ? -1 : id;
  }),
  setAlert: action((state, alert) => {
    state.alert = alert;
  }),
};

export default ui;
