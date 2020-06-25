import { WalletLogsComponent } from "../../components/wallet/Logs";
import React from "react";
import { useStoreState } from "../../hooks";

export const WalletLogsContainer = () => {
  const { logs } = useStoreState((state) => state.wallet);

  return (
    <div>
      <br />
      <WalletLogsComponent logs={logs} />
    </div>
  );
};
