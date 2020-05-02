import React, { useCallback } from "react";
import { TransactionAmountComponent } from "../../components/transaction/send/TransactionAmount";
import { Intent, Position, Toaster } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";

export const TransactionAmountContainer = () => {
  const { spendable } = useStoreState((state) => state.walletSummary);
  const { amount, fee, message, strategy, inputs } = useStoreState(
    (state) => state.sendCoinsModel
  );
  const { token } = useStoreState((state) => state.session);
  const { estimateFee, setAmount } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  const onAmountChange = useCallback(
    async (amount: string) => {
      if (amount === undefined || amount.slice(-1) === ".") return;
      const _amount = Number(amount);
      if (_amount < 0) return;
      setAmount(amount);
      await estimateFee({
        amount: _amount,
        strategy: strategy,
        message: message,
        token: token,
        inputs: inputs,
      }).catch((error: { message: string }) => {
        Toaster.create({ position: Position.TOP }).show({
          message: error.message,
          intent: Intent.WARNING,
          icon: "warning-sign",
        });
      });
    },
    [strategy, message, token, inputs, estimateFee, setAmount]
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
