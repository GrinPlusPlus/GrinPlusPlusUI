import InitComponent from "../components/extras/Init";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";
import { useInterval } from "../helpers";
import { INodeStatus } from "../interfaces/INodeStatus";

export const InitializerContainer = () => {
  let history = useHistory();
  const { message, initializingError, isWalletInitialized } = useStoreState(
    (state) => state.wallet
  );

  const {
    initializeWallet,
    setMessage,
    setInitializingError,
  } = useStoreActions((state) => state.wallet);

  const { status } = useStoreState((state) => state.nodeSummary);

  const { checkStatus, updateStatus } = useStoreActions(
    (actions) => actions.nodeSummary
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
    if (status.toLowerCase() !== "not connected") {
      require("electron-log").info(
        "STATUS received, the API's up! Redirecting to Login..."
      );
      history.push("/login");
      return;
    }
    if (initializingError) return;
    require("electron-log").info("Trying to get the Node status...");
    await checkStatus().then((status: INodeStatus) => updateStatus(status));
  }, 500);

  return (
    <InitComponent
      isInitialized={status.toLowerCase() !== "not connected"}
      error={initializingError}
      message={message}
    />
  );
};
