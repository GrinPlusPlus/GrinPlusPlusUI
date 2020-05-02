import React, { useEffect, Suspense } from "react";
import { Redirect } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";
import { LoadingComponent } from "../components/extras/Loading";

const InitComponent = React.lazy(() =>
  import("./../components/extras/Init").then((module) => ({
    default: module.InitComponent,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const InitializerContainer = () => {
  const { message, initializingError, isWalletInitialized } = useStoreState(
    (state) => state.wallet
  );

  const {
    initializeWallet,
    setMessage,
    setInitializingError,
  } = useStoreActions((state) => state.wallet);

  const { status, updateInterval } = useStoreState(
    (state) => state.nodeSummary
  );

  const { checkStatus, updateStatus } = useStoreActions(
    (actions) => actions.nodeSummary
  );

  useEffect(() => {
    (async function() {
      if (!isWalletInitialized) {
        require("electron-log").info("Initializing Backend.");
        await initializeWallet().catch((error: string) => {
          setMessage(error);
          setInitializingError(true);
          require("electron-log").info(
            `Error trying to Initialize the Backend: ${error}`
          );
        });
      }
    })();
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await checkStatus();
        updateStatus(status);
      } catch (error) {
        require("electron-log").error(
          `Error trying to get Node Status: ${error.message}`
        );
        updateStatus(undefined);
      }
    }, updateInterval);
    return () => clearInterval(interval);
  });

  return (
    <Suspense fallback={renderLoader()}>
      {status.toLowerCase() !== "not connected" ? (
        <Redirect to="/login" />
      ) : null}
      <InitComponent
        isInitialized={status.toLowerCase() !== "not connected"}
        error={initializingError}
        message={message}
      />
    </Suspense>
  );
};
