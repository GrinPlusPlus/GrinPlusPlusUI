import { Intent, Position, OverlayToaster } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { SpendableComponent } from "../../components/transaction/send/SpendableComponent";
import { useStoreState, useStoreActions } from "../../hooks";

export const SpendableContainer = () => {
  const { spendable } = useStoreState((state) => state.walletSummary);
  const { message, strategy, inputs } = useStoreState(
    (state) => state.sendCoinsModel
  );
  const { token } = useStoreState((state) => state.session);
  const { estimateFee, setAmount } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  const onSendMaxButtonClicked = useCallback(async () => {
    setAmount(spendable.toString());
    await estimateFee({
      amount: undefined,
      strategy: strategy,
      message: message,
      token: token,
      inputs: inputs,
    }).catch((error: { message: string }) => {
      OverlayToaster.create({ position: Position.BOTTOM }).show({
        message: error.message,
        intent: Intent.WARNING,
        icon: "warning-sign",
      });
    });
  }, [strategy, message, token, inputs, estimateFee, setAmount, spendable]);

  return (
    <SpendableComponent
      spendable={spendable}
      onSendMaxButtonClickedCb={onSendMaxButtonClicked}
    />
  );
};
