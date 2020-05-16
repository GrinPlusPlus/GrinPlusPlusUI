import {
  Action,
  action,
  Computed,
  computed,
  Thunk,
  thunk
  } from 'easy-peasy';
import { cleanTxType } from '../../helpers';
import { Injections } from '../../store';
import { ITransaction } from '../../interfaces/ITransaction';
import { StoreModel } from '..';

export interface WalletSummaryModel {
  spendable: number;
  total: number;
  immature: number;
  unconfirmed: number;
  locked: number;
  updateSummaryInterval: number;
  selectedTx: number;
  transactions: ITransaction[] | undefined;
  setSelectedTx: Action<WalletSummaryModel, number>;
  updateSummary: Action<
    WalletSummaryModel,
    {
      transactions: ITransaction[];
      formatCb: (amount: number) => number;
    }
  >;
  updateBalance: Action<
    WalletSummaryModel,
    {
      spendable: number;
      total: number;
      immature: number;
      unconfirmed: number;
      locked: number;
      formatCb: (amount: number) => number;
    }
  >;
  updateWalletSummary: Thunk<
    WalletSummaryModel,
    string,
    Injections,
    StoreModel
  >;
  updateWalletBalance: Thunk<
    WalletSummaryModel,
    string,
    Injections,
    StoreModel
  >;
  cancelTransaction: Thunk<
    WalletSummaryModel,
    {
      token: string;
      txId: number;
    },
    Injections,
    StoreModel
  >;
  repostTransaction: Thunk<
    WalletSummaryModel,
    {
      token: string;
      txId: number;
    },
    Injections,
    StoreModel
  >;
  getAllTransactions: Computed<WalletSummaryModel, ITransaction[]>;
  getTransactionsSent: Computed<WalletSummaryModel, ITransaction[]>;
  getTransactionsReceived: Computed<WalletSummaryModel, ITransaction[]>;
  getUnconfirmedTransactions: Computed<WalletSummaryModel, ITransaction[]>;
  getCancelledTransactions: Computed<WalletSummaryModel, ITransaction[]>;
  getCoinbaseTransactions: Computed<WalletSummaryModel, ITransaction[]>;
  waitingResponse: boolean;
  setWaitingResponse: Action<WalletSummaryModel, boolean>;
}

const walletSummary: WalletSummaryModel = {
  spendable: 0,
  total: 0,
  immature: 0,
  unconfirmed: 0,
  locked: 0,
  updateSummaryInterval: 5000,
  selectedTx: -1,
  transactions: undefined,
  setSelectedTx: action((state, id) => {
    state.selectedTx = id;
  }),
  updateSummary: action((state, payload) => {
    state.transactions = payload.transactions.map((tx) => {
      tx.outputs = tx.outputs?.map((output) => {
        return {
          amount: payload.formatCb(output.amount),
          commitment: output.commitment,
        };
      });
      tx.amountCredited = payload.formatCb(tx.amountCredited);
      tx.amountDebited = payload.formatCb(tx.amountDebited);
      if (tx.fee) tx.fee = payload.formatCb(tx.fee);
      return tx;
    });
  }),
  updateBalance: action((state, payload) => {
    state.spendable = payload.formatCb(payload.spendable);
    state.total = payload.formatCb(payload.total);
    state.immature = payload.formatCb(payload.immature);
    state.unconfirmed = payload.formatCb(payload.unconfirmed);
    state.locked = payload.formatCb( payload.locked);
  }),
  updateWalletSummary: thunk(
    async (actions, token, { injections, getStoreActions, getStoreState }) => {
      if (getStoreState().walletSummary.waitingResponse) return;
      actions.setWaitingResponse(true);
      const { ownerService, utilsService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      await new ownerService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .getWalletSummary(token)
        .then((transactions) => {
          const newSent = transactions.filter(
            (t) => cleanTxType(t.type) === "sent"
          ).length;
          const newReceived = transactions.filter(
            (t) => cleanTxType(t.type) === "received"
          ).length;

          const currentSent = getStoreState().walletSummary.transactions?.filter(
            (t) => cleanTxType(t.type) === "sent"
          ).length;
          const currentReceived = getStoreState().walletSummary.transactions?.filter(
            (t) => cleanTxType(t.type) === "received"
          ).length;

          if (currentSent !== undefined && newSent > currentSent) {
            getStoreActions().ui.setAlert("last_transaction_sent");
          } else if (
            currentReceived !== undefined &&
            newReceived > currentReceived
          ) {
            getStoreActions().ui.setAlert("new_transaction_received");
          }
          actions.updateSummary({
            transactions: transactions,
            formatCb: utilsService.formatGrinAmount,
          });
        })
        .catch((error) => {
          require("electron-log").info(
            `trying to get Wallet Summary: ${error}`
          );
        });
      actions.setWaitingResponse(false);
    }
  ),
  updateWalletBalance: thunk(
    async (actions, token, { injections, getStoreActions, getStoreState }) => {
      if (getStoreState().walletSummary.waitingResponse) return;
      const { ownerService, utilsService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .getWalletBalance(token)
        .then((balance) => {
          actions.updateBalance({
            spendable: balance.spendable,
            total: balance.total,
            immature: balance.immature,
            unconfirmed: balance.unconfirmed,
            locked: balance.locked,
            formatCb: utilsService.formatGrinAmount,
          });
        })
        .catch((error) => {
          require("electron-log").info(
            `trying to get Wallet Balance: ${error}`
          );
        });
    }
  ),
  cancelTransaction: thunk(
    async (actions, payload, { injections, getStoreState }) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      ).cancelTx(payload.token, payload.txId);
    }
  ),
  repostTransaction: thunk(
    async (actions, payload, { injections, getStoreState }) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      ).repostTx(payload.token, payload.txId);
    }
  ),
  getAllTransactions: computed((state) => {
    if (state.transactions === undefined) return [];
    return state.transactions;
  }),
  getTransactionsSent: computed((state) => {
    if (state.transactions === undefined) return [];
    return state.transactions.filter((t) =>
      ["sent"].includes(cleanTxType(t.type))
    );
  }),
  getTransactionsReceived: computed((state) => {
    if (state.transactions === undefined) return [];
    return state.transactions.filter((t) => cleanTxType(t.type) === "received");
  }),
  getUnconfirmedTransactions: computed((state) => {
    if (state.transactions === undefined) return [];
    return state.transactions.filter((t) =>
      [
        "sending_not_finalized",
        "receiving_unconfirmed",
        "sending_finalized",
      ].includes(cleanTxType(t.type))
    );
  }),
  getCancelledTransactions: computed((state) => {
    if (state.transactions === undefined) return [];
    return state.transactions.filter((t) => cleanTxType(t.type) === "canceled");
  }),
  getCoinbaseTransactions: computed((state) => {
    if (state.transactions === undefined) return [];
    return state.transactions.filter((t) => cleanTxType(t.type) === "coinbase");
  }),
  waitingResponse: false,
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
};

export default walletSummary;
