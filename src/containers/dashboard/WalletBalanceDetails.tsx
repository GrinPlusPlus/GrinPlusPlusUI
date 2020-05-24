import React from "react";
import { WalletBalanceDetailsComponent } from "../../components/dashboard/WalletBalanceDetails";
import { useStoreState } from "../../hooks";

export const WalletBalanceDetailsContainer = () => {
  const { total, immature, unconfirmed, locked } = useStoreState(
    (state) => state.walletSummary
  );

  return (
    <WalletBalanceDetailsComponent
      total={total}
      immature={immature}
      unconfirmed={unconfirmed}
      locked={locked}
    />
  );
};
