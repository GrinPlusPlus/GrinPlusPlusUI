import {
  Alert,
  Intent,
  Position,
  Toaster,
  Dialog,
  Button,
} from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { SlatepackComponent } from "../../components/extras/Slatepack";

import { WalletActivityComponent } from "../../components/dashboard/WalletActivity";
import { useTranslation } from "react-i18next";
import { HorizontallyCenter, SlatesBox, Title } from "../../components/styled";
import { validateSlatepack } from "../../services/utils";

export const WalletActivitiyContainer = () => {
  const { t } = useTranslation();

  const {
    getAllTransactions,
    getTransactionsReceived,
    getTransactionsSent,
    getUnconfirmedTransactions,
    getCancelledTransactions,
    getCoinbaseTransactions,
    selectedTxToCancel,
    selectedTxToFinalize,
    selectedSlatepackMessage,
  } = useStoreState((state) => state.walletSummary);

  const { token } = useStoreState((state) => state.session);
  const { transactionOpened } = useStoreState((state) => state.ui);
  const { useGrinJoin } = useStoreState((state) => state.settings);
  const { blocks: lastConfirmedHeight } = useStoreState(
    (state) => state.nodeSummary
  );
  const { confirmations } = useStoreState((state) => state.settings);

  const { openTransaction } = useStoreActions((state) => state.ui);
  const {
    cancelTransaction,
    repostTransaction,
    setSelectedTxToCancel,
    setSelectedTxToRepost,
    setSelectedTxToFinalize,
    setSelectedSlatepackMessage,
  } = useStoreActions((state) => state.walletSummary);

  const { slatepackMessageToFinalize } = useStoreState(
    (state) => state.sendCoinsModel
  );

  const { setSlatepackMessageToFinalize } = useStoreActions(
    (state) => state.sendCoinsModel
  );

  const { finalizeTxViaSlatepack } = useStoreActions(
    (actions) => actions.finalizeModel
  );

  const onViewSlatepackMessageButtonClicked = useCallback(
    (txId: number) => {
      const transaction = getAllTransactions.find((t) => t.Id === txId);
      require("electron-log").info(transaction);
      if (transaction?.slatepackMessage !== undefined) {
        setSelectedSlatepackMessage(transaction.slatepackMessage);
      }
    },
    [getAllTransactions, setSelectedSlatepackMessage]
  );

  const onCancelTransactionButtonClicked = useCallback(
    async (txId: number) => {
      setSelectedTxToCancel(-1); // not the best practice, but it's faster
      try {
        require("electron-log").info(`Trying to Cancel Tx with Id: ${txId}`);
        await cancelTransaction({
          token: token,
          txId: txId,
        });
        require("electron-log").info("Canceled!");
      } catch (error) {
        require("electron-log").error(`Error trying to Cancel Tx: ${error}`);
      }
    },
    [token, cancelTransaction, setSelectedTxToCancel]
  );

  const onRepostTransactionButtonClicked = useCallback(
    async (txId: number, method: string) => {
      setSelectedTxToRepost(-1); // not the best practice, but it's faster
      try {
        require("electron-log").info(`Trying to Repost Tx with Id: ${txId}`);
        await repostTransaction({
          token: token,
          txId: txId,
          method: method,
        }).then((response: string) => {
          if (response.trim().toLowerCase() === "success") {
            Toaster.create({ position: Position.BOTTOM }).show({
              message: t("finished_without_errors"),
              intent: Intent.SUCCESS,
              icon: "tick-circle",
            });
          } else {
            Toaster.create({ position: Position.BOTTOM }).show({
              message: response,
              intent: Intent.WARNING,
              icon: "warning-sign",
            });
          }
        });
        require("electron-log").info("Reposted!");
      } catch (error) {
        require("electron-log").error(`Error trying to Repost Tx: ${error}`);
      }
    },
    [token, repostTransaction, setSelectedTxToRepost, t]
  );

  const finalizeTransaction = useCallback(
    (slatepack: string) => {
      finalizeTxViaSlatepack(slatepack).then((result: { error: string }) => {
        if (result.error == null) {
          Toaster.create({ position: Position.BOTTOM }).show({
            message: t("finished_without_errors"),
            intent: Intent.SUCCESS,
            icon: "tick-circle",
          });
          setSelectedTxToFinalize(-1);
          setSlatepackMessageToFinalize("");
        } else {
          Toaster.create({ position: Position.BOTTOM }).show({
            message: t("finished_without_errors"),
            intent: Intent.DANGER,
            icon: "warning-sign",
          });
        }
      });
    },
    [
      finalizeTxViaSlatepack,
      t,
      setSlatepackMessageToFinalize,
      setSelectedTxToFinalize,
    ]
  );

  return (
    <div>
      <Title>{t("transactions")}</Title>
      <WalletActivityComponent
        all={getAllTransactions}
        received={getTransactionsReceived}
        sent={getTransactionsSent}
        notFinalized={getUnconfirmedTransactions}
        canceled={getCancelledTransactions}
        coinbase={getCoinbaseTransactions}
        transactionOpened={transactionOpened}
        openTransactionCb={openTransaction}
        onCancelTransactionButtonClickedCb={setSelectedTxToCancel}
        onFinalizeTransactionButtonClickedCb={setSelectedTxToFinalize}
        onRepostTransactionButtonClickedCb={onRepostTransactionButtonClicked}
        onViewSlatepackMessageButtonClickedCb={
          onViewSlatepackMessageButtonClicked
        }
        lastConfirmedHeight={lastConfirmedHeight}
        confirmations={confirmations}
      />
      <Alert
        className="bp3-dark"
        cancelButtonText="Close"
        confirmButtonText="Cancel Transaction"
        icon="warning-sign"
        intent={Intent.WARNING}
        isOpen={selectedTxToCancel > -1}
        onCancel={() => setSelectedTxToCancel(-1)}
        onConfirm={() => onCancelTransactionButtonClicked(selectedTxToCancel)}
      >
        <p>{t("cancelation_confirmation")}</p>
      </Alert>
      <Dialog
        title="Slatepack"
        className="bp3-dark"
        isOpen={selectedSlatepackMessage.length > 0}
        onClose={() => {
          setSelectedSlatepackMessage("");
        }}
      >
        <SlatepackComponent slatepack={selectedSlatepackMessage} />
      </Dialog>
      <Dialog
        title="Slatepack"
        className="bp3-dark"
        isOpen={selectedTxToFinalize > -1}
        onClose={() => {
          setSelectedTxToFinalize(-1);
          setSlatepackMessageToFinalize("");
        }}
      >
        <SlatesBox
          data-testid="slatepack-box"
          defaultValue={slatepackMessageToFinalize}
          onChange={(event: React.FormEvent<HTMLTextAreaElement>) => {
            const target: HTMLTextAreaElement = event.target;
            setSlatepackMessageToFinalize(target.value);
          }}
        ></SlatesBox>
        <div style={{ marginTop: "5px" }}>
          <HorizontallyCenter>
            <Button
              minimal={true}
              disabled={validateSlatepack(slatepackMessageToFinalize) === false}
              intent={Intent.PRIMARY}
              text={t("finalize")}
              onClick={() => {
                finalizeTransaction(slatepackMessageToFinalize);
              }}
            />
          </HorizontallyCenter>
        </div>
      </Dialog>
    </div>
  );
};
