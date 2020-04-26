import { Action, action } from 'easy-peasy';

export interface UIModel {
  showSettings: boolean;
  transactionOpened: number;
  alert: string | undefined;
  toggleSettings: Action<UIModel>;
  openTransaction: Action<UIModel, number>;
  setAlert: Action<UIModel, string | undefined>;
}

const ui: UIModel = {
  showSettings: false,
  transactionOpened: -1,
  alert: undefined,
  toggleSettings: action((state) => {
    state.showSettings = !state.showSettings;
  }),
  openTransaction: action((state, id) => {
    if (state.transactionOpened === id) {
      state.transactionOpened = -1;
    } else {
      state.transactionOpened = id;
    }
  }),
  setAlert: action((state, alert) => {
    state.alert = alert;
  }),
};

export default ui;
