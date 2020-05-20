import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "../hooks";

import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";

const InitComponent = React.lazy(() =>
  import("./../components/extras/Init").then((module) => ({
    default: module.InitComponent,
  }))
);

export const InitializerContainer = () => {
  const { t, i18n } = useTranslation();

  const { message, initializingError } = useStoreState((state) => state.wallet);
  const { language } = useStoreState((state) => state.idiom);
  const { status } = useStoreState((state) => state.nodeSummary);

  const { initializeWallet } = useStoreActions((state) => state.wallet);

  useEffect(() => {
    (async function() {
      const log = require("electron-log");
      log.info("Initializing Backend.");
      log.info(`Setting "${language}" as language...`);
      i18n.changeLanguage(language);
      try {
        if (await initializeWallet()) {
          log.info("Backend initialized.");
        } else {
          log.info("Backend is not Running.");
        }
      } catch (error) {
        log.error(`Error trying to Initialize the Backend: ${error}`);
      }
    })();
  }, [language, initializeWallet, i18n]);

  return (
    <div>
      {status.toLowerCase() !== "not connected" ? (
        <Redirect to="/login" />
      ) : null}
      <InitComponent error={initializingError} message={t(`${message}`)} />
    </div>
  );
};
