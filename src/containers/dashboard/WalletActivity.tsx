import React, { useCallback } from "react";
import { WalletActivityComponent } from "../../components/dashboard/WalletActivity";
import { Alert, Intent, Position, Toaster } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

export const WalletActivitiyContainer = () => {
  const { t } = useTranslation();

  const {
    getAllTransactions,
    getTransactionsReceived,
    getTransactionsSent,
    getUnconfirmedTransactions,
    getCancelledTransactions,
    getCoinbaseTransactions,
    selectedTx
  } = useStoreState(state => state.walletSummary);
  const { token } = useStoreState(state => state.session);
  const { transactionOpened } = useStoreState(state => state.ui);
  const { useGrinJoin } = useStoreState(state => state.settings);

  const { openTransaction } = useStoreActions(state => state.ui);
  const {
    cancelTransaction,
    repostTransaction,
    setSelectedTx
  } = useStoreActions(state => state.walletSummary);

  const onCancelTransactionButtonClicked = useCallback(
    async (txId: number) => {
      setSelectedTx(-1); // not the best practice, but it's faster
      try {
        require("electron-log").info(`Trying to Cancel Tx with Id: ${txId}`);
        await cancelTransaction({
          token: token,
          txId: txId
        });
        require("electron-log").info("Canceled!");
      } catch (error) {
        require("electron-log").error(`Error trying to Cancel Tx: ${error}`);
      }
    },
    [token, cancelTransaction, setSelectedTx]
  );

  const onRepostTransactionButtonClicked = useCallback(
    async (txId: number, method: string) => {
      setSelectedTx(-1); // not the best practice, but it's faster
      try {
        require("electron-log").info(`Trying to Repost Tx with Id: ${txId}`);
        await repostTransaction({
          token: token,
          txId: txId,
          method: method
        }).then((response: string) => {
          if (response.length > 0) return;
          Toaster.create({ position: Position.BOTTOM }).show({
            message: response,
            intent: Intent.WARNING,
            icon: "warning-sign"
          });
        });
        require("electron-log").info("Reposted!");
      } catch (error) {
        require("electron-log").error(`Error trying to Repost Tx: ${error}`);
      }
    },
    [token, repostTransaction, setSelectedTx]
  );

  return (
    <div>
      <WalletActivityComponent
        all={getAllTransactions}
        received={getTransactionsReceived}
        sent={getTransactionsSent}
        notFinalized={getUnconfirmedTransactions}
        canceled={getCancelledTransactions}
        coinbase={getCoinbaseTransactions}
        transactionOpened={transactionOpened}
        openTransactionCb={openTransaction}
        onCancelTransactionButtonClickedCb={setSelectedTx}
        onRepostTransactionButtonClickedCb={onRepostTransactionButtonClicked}
        method={useGrinJoin ? "JOIN" : "STEM"}
      />
      <Alert
        className="bp3-dark"
        cancelButtonText="Close"
        confirmButtonText="Cancel Transaction"
        icon="warning-sign"
        intent={Intent.WARNING}
        isOpen={selectedTx > -1}
        onCancel={() => setSelectedTx(-1)}
        onConfirm={() => onCancelTransactionButtonClicked(selectedTx)}
      >
        <p>{t("cancelation_confirmation")}</p>
      </Alert>
    </div>
  );
};
