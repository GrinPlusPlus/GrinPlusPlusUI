import InitComponent from "../components/extras/Init";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";

export default function InitializerContainer() {
  let history = useHistory();
  const { message, initializingError, isWalletInitialized } = useStoreState(
    (state) => state.wallet
  );
  const { accounts } = useStoreState((state) => state.signinModel);

  const { initializeWallet } = useStoreActions((state) => state.wallet);
  const { getAccounts } = useStoreActions((actions) => actions.signinModel);

  useEffect(() => {
    if (!isWalletInitialized) {
      require("electron-log").info("Initializing Wallet.");
      initializeWallet();
    }
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      require("electron-log").info("Trying to get the local accounts...");
      if (accounts !== undefined) {
        require("electron-log").info(
          "Status 200 received, redirecting to Login..."
        );
        history.push("/login");
      }
      await getAccounts();
    }, 1000);
    return () => clearInterval(interval);
  }, [getAccounts, accounts, history]);

  return (
    <InitComponent
      isInitialized={accounts !== undefined}
      error={initializingError}
      message={message}
    />
  );
}
