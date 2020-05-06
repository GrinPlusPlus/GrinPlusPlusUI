import React, { useEffect, Suspense } from "react";
import { Redirect } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";
import { useTranslation } from "react-i18next";
import { LoadingComponent } from "../components/extras/Loading";

const InitComponent = React.lazy(() =>
  import("./../components/extras/Init").then((module) => ({
    default: module.InitComponent,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const InitializerContainer = () => {
  const { t } = useTranslation();

  const { message, initializingError, isWalletInitialized } = useStoreState(
    (state) => state.wallet
  );

  const {
    initializeWallet,
    setMessage,
    setInitializingError,
  } = useStoreActions((state) => state.wallet);

  const { status } = useStoreState((state) => state.nodeSummary);

  useEffect(() => {
    (async function() {
      if (!isWalletInitialized) {
        require("electron-log").info("Initializing Backend.");
        await initializeWallet()
          .then(() => {
            require("electron-log").info("Backend initialized.");
          })
          .catch((error: string) => {
            setMessage(error);
            setInitializingError(true);
            require("electron-log").info(
              `Error trying to Initialize the Backend: ${error}`
            );
          });
      }
    })();
  });

  return (
    <Suspense fallback={renderLoader()}>
      {status.toLowerCase() !== "not connected" ? (
        <Redirect to="/login" />
      ) : null}
      <InitComponent
        isInitialized={status.toLowerCase() !== "not connected"}
        error={initializingError}
        message={t(`${message}.1`)}
      />
    </Suspense>
  );
};
