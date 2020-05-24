import React from "react";
import { WalletBalanceComponent } from "../../components/dashboard/WalletBalance";
import { useStoreState } from "../../hooks";

export const WalletBalanceContainer = () => {
  const { spendable } = useStoreState((state) => state.walletSummary);

  return <WalletBalanceComponent spendable={spendable} />;
};
