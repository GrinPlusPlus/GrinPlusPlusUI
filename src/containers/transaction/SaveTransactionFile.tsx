import React, { useCallback } from 'react';
import { Intent, Position, Toaster } from '@blueprintjs/core';
import { SaveTransactionFileComponent } from '../../components/transaction/send/SaveTransactionFile';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../hooks';

export const SaveTransactionFileContainer = () => {
  let history = useHistory();

  const { spendable } = useStoreState((state) => state.walletSummary);
  const { amount, message, strategy, inputs, fee } = useStoreState(
    (state) => state.sendCoinsModel
  );
  const { token } = useStoreState((state) => state.session);
  const { sendViaFile } = useStoreActions((actions) => actions.sendCoinsModel);

  const onSaveButtonClicked = useCallback(async () => {
    if (amount === undefined || amount.slice(-1) === ".") return;
    try {
      const sent = await sendViaFile({
        amount: Number(amount),
        strategy: strategy,
        inputs: inputs,
        message: message,
        token: token,
      }).catch((error: { message: string }) => {
        Toaster.create({ position: Position.TOP }).show({
          message: error.message,
          intent: Intent.DANGER,
          icon: "warning-sign",
        });
      });
      if (sent) {
        history.push("/wallet");
      }
    } catch (error) {}
  }, [sendViaFile, amount, message, inputs, token, strategy, history]);

  return (
    <SaveTransactionFileComponent
      spendable={spendable}
      fee={fee}
      amount={amount ? Number(amount) : 0}
      inputsSelected={inputs.length !== 0}
      onSaveButtonClickedCb={onSaveButtonClicked}
    />
  );
};
