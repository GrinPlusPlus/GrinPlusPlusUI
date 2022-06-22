import { Intent, Position, OverlayToaster } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { TransactionAmountComponent } from "../../components/transaction/send/TransactionAmount";
import { countDecimalPlaces } from "@blueprintjs/core/lib/esm/common/utils";

export const TransactionAmountContainer = () => {
  const { spendable } = useStoreState((state) => state.walletSummary);
  const { amount, fee, message, strategy, inputs } = useStoreState(
    (state) => state.sendCoinsModel
  );
  const { token } = useStoreState((state) => state.session);
  const { estimateFee, setAmount, setEstimatedFee } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  const onAmountChange = useCallback(
    async (amount: string) => {
      if (amount === undefined || amount.slice(-1) === ".") return;
      setAmount(amount);
      const _amount = Number(amount);
      if (countDecimalPlaces(_amount) > 9) return;
      if (_amount <= 0) {
        setEstimatedFee(0.0);
        return;
      }
      await estimateFee({
        amount: amount,
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
    },
    [strategy, message, token, inputs, estimateFee, setAmount, setEstimatedFee]
  );

  return (
    <TransactionAmountComponent
      spendable={spendable}
      amount={amount ? amount : ""}
      fee={fee}
      onAmountChangeCb={onAmountChange}
    />
  );
};
