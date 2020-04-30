import InitComponent from "../components/extras/Init";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";
import { useInterval } from "../helpers";

export default function InitializerContainer() {
  let history = useHistory();
  const { message, initializingError, isWalletInitialized } = useStoreState(
    (state) => state.wallet
  );
  const { accounts } = useStoreState((state) => state.signinModel);

  const {
    initializeWallet,
    setMessage,
    setInitializingError,
  } = useStoreActions((state) => state.wallet);
  const { getAccounts, setAccounts } = useStoreActions(
    (actions) => actions.signinModel
  );

  useEffect(() => {
    (async function() {
      if (!isWalletInitialized) {
        require("electron-log").info("Initializing Wallet.");
        await initializeWallet().catch((error: string) => {
          setMessage(error);
          setInitializingError(true);
        });
      }
    })();
  });

  useInterval(async () => {
    if (accounts !== undefined) {
      require("electron-log").info(
        "Accounts received, API's up! Redirecting to Login..."
      );
      history.push("/login");
      return;
    }
    if (initializingError) return;
    require("electron-log").info("Trying to get the local accounts...");
    await getAccounts().then((accounts: string[]) => setAccounts(accounts));
  }, 1000);

  return (
    <InitComponent
      isInitialized={accounts !== undefined}
      error={initializingError}
      message={message}
    />
  );
}
