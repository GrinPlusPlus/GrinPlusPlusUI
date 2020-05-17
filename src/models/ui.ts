import { Action, action } from "easy-peasy";

export interface UIModel {
  showSettings: boolean;
  transactionOpened: number;
  alert: string | undefined;
  toggleSettings: Action<UIModel, boolean>;
  openTransaction: Action<UIModel, number>;
  setAlert: Action<UIModel, string | undefined>;
}

const ui: UIModel = {
  showSettings: false,
  transactionOpened: -1,
  alert: undefined,
  toggleSettings: action((state, value) => {
    state.showSettings = value;
  }),
  openTransaction: action((state, id) => {
    state.transactionOpened = state.transactionOpened === id ? -1 : id;
  }),
  setAlert: action((state, alert) => {
    state.alert = alert;
  })
};

export default ui;
