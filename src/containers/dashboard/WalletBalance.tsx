import React from "react";
import { WalletBalanceComponent } from "../../components/dashboard/WalletBalance";
import { useStoreState } from "../../hooks";

export const WalletBalanceContainer = () => {
  const { total, spendable, immature, unconfirmed, locked } = useStoreState(
    (state) => state.walletSummary
  );

  return (
    <WalletBalanceComponent
      total={total}
      spendable={spendable}
      immature={immature}
      unconfirmed={unconfirmed}
      locked={locked}
    />
  );
};
