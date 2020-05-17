import React, { useCallback } from "react";
import { SaveTransactionFileComponent } from "../../components/transaction/send/SaveTransactionFile";
import { useStoreActions, useStoreState } from "../../hooks";
import { useHistory } from "react-router-dom";
import { Toaster, Position, Intent } from "@blueprintjs/core";

export const SaveTransactionFileContainer = () => {
  let history = useHistory();

  const { spendable } = useStoreState(state => state.walletSummary);
  const { amount, inputs, fee, message, strategy } = useStoreState(
    state => state.sendCoinsModel
  );
  const { username, token } = useStoreState(state => state.session);

  const {
    setUsername: setUsernamePrompt,
    setCallback: setCallbackPrompt
  } = useStoreActions(state => state.passwordPrompt);
  const { sendViaFile } = useStoreActions(actions => actions.sendCoinsModel);

  const onSaveButtonClicked = useCallback(async () => {
    if (amount === undefined || amount.slice(-1) === ".") return;
    try {
      const sent = await sendViaFile({
        amount: Number(amount),
        strategy: strategy,
        inputs: inputs,
        message: message,
        token: token
      }).catch((error: { message: string }) => {
        Toaster.create({ position: Position.BOTTOM }).show({
          message: error.message,
          intent: Intent.DANGER,
          icon: "warning-sign"
        });
      });
      if (sent) {
        history.push("/wallet");
      }
    } catch (error) {}
  }, [sendViaFile, amount, message, inputs, token, strategy, history]);

  return (
    <div>
      <SaveTransactionFileComponent
        spendable={spendable}
        fee={fee}
        amount={amount ? Number(amount) : 0}
        inputsSelected={inputs.length !== 0}
        onSaveButtonClickedCb={() => {
          setUsernamePrompt(username);
          setCallbackPrompt(onSaveButtonClicked);
        }}
      />
    </div>
  );
};
