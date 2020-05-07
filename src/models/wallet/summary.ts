import { Action, action, Computed, computed, Thunk, thunk } from "easy-peasy";
import { cleanTxType } from "../../helpers";
import { Injections } from "../../store";
import { ITransaction } from "../../interfaces/ITransaction";
import { StoreModel } from "..";

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
  update: Action<
    WalletSummaryModel,
    {
      summary: {
        spendable: number;
        total: number;
        immature: number;
        unconfirmed: number;
        locked: number;
        transactions: ITransaction[];
      };
      format: (amount: number) => number;
    }
  >;
  updateWalletSummary: Thunk<
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
  update: action((state, payload) => {
    state.spendable = payload.format(payload.summary.spendable);
    state.total = payload.format(payload.summary.total);
    state.immature = payload.format(payload.summary.immature);
    state.unconfirmed = payload.format(payload.summary.unconfirmed);
    state.locked = payload.format(payload.summary.locked);

    state.transactions = payload.summary.transactions.map((tx) => {
      tx.amountCredited = payload.format(tx.amountCredited);
      tx.amountDebited = payload.format(tx.amountDebited);
      if (tx.fee) tx.fee = payload.format(tx.fee);
      return tx;
    });
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
        .then((summary) => {
          if (!summary) return;

          if (getStoreState().walletSummary.transactions !== undefined) {
            const newSent = summary.transactions.filter(
              (t) => cleanTxType(t.type) === "sent"
            ).length;
            const currentSent = getStoreState().walletSummary.transactions?.filter(
              (t) => cleanTxType(t.type) === "sent"
            ).length;

            const newReceived = summary.transactions.filter(
              (t) => cleanTxType(t.type) === "received"
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
          }

          actions.update({
            summary: summary,
            format: utilsService.formatGrinAmount,
          });
        });
      actions.setWaitingResponse(false);
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
