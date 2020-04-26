import React, { useCallback } from 'react';
import WalletActivityComponent from '../../components/dashboard/WalletActivity';
import {
  Alert,
  Intent,
  Position,
  Toaster
  } from '@blueprintjs/core';
import { useStoreActions, useStoreState } from '../../hooks';

export default function WalletActivitiyContainer() {
  const {
    getAllTransactions,
    getTransactionsReceived,
    getTransactionsSent,
    getUnconfirmedTransactions,
    getCancelledTransactions,
    getCoinbaseTransactions,
    selectedTx,
  } = useStoreState((state) => state.walletSummary);
  const { token } = useStoreState((state) => state.session);
  const { transactionOpened } = useStoreState((state) => state.ui);
  const { openTransaction } = useStoreActions((state) => state.ui);

  const {
    cancelTransaction,
    repostTransaction,
    setSelectedTx,
  } = useStoreActions((state) => state.walletSummary);

  const onCancelTransactionButtonClicked = useCallback(
    async (txId: number) => {
      setSelectedTx(-1); // not the best practice, but it's faster
      await cancelTransaction({
        token: token,
        txId: txId,
      });
    },
    [token, cancelTransaction, setSelectedTx]
  );

  const onRepostTransactionButtonClicked = useCallback(
    async (txId: number) => {
      setSelectedTx(-1); // not the best practice, but it's faster
      await repostTransaction({
        token: token,
        txId: txId,
      }).then((response: string) => {
        if (response.length > 0) return;
        Toaster.create({ position: Position.TOP }).show({
          message: response,
          intent: Intent.WARNING,
          icon: "warning-sign",
        });
      });
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
        <p>
          Are you sure you want to <b>cancel</b> this Transaction?
        </p>
      </Alert>
    </div>
  );
}
