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
  const { estimateFee } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  const onSendMaxButtonClicked = useCallback(async () => {
    await estimateFee({
      amount: undefined,
      strategy: strategy,
      message: message,
      token: token,
      inputs: inputs,
    }).catch((error: any) => {
      OverlayToaster.create({ position: Position.BOTTOM }).show({
        message: error.message,
        intent: Intent.WARNING,
        icon: "warning-sign",
      });
    });
  }, [strategy, message, token, inputs, estimateFee]);

  return (
    <SpendableComponent
      spendable={spendable}
      onSendMaxButtonClickedCb={onSendMaxButtonClicked}
    />
  );
};
