import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "../hooks";

import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InitComponent } from "../components/extras/Init";

export const InitializerContainer = () => {
  const { t, i18n } = useTranslation();

  const { message, initializingError } = useStoreState((state) => state.wallet);
  const { language } = useStoreState((state) => state.idiom);

  let history = useHistory();

  const { initializeWallet } = useStoreActions((state) => state.wallet);

  useEffect(() => {
    (async function() {
      const log = require("electron-log");
      log.info("Initializing Backend.");
      log.info(`Setting "${language}" as language...`);
      i18n.changeLanguage(language);
      try {
        if (!(await initializeWallet())) {
          log.info("Backend is not Running.");
        } else {
          history.push("/login"); // Redirect to Login
        }
      } catch (error) {
        log.error(`Error trying to Initialize the Backend: ${error}`);
      }
    })();
  }, [language, initializeWallet, i18n, history]);

  return (
    <div>
      <InitComponent error={initializingError} message={t(`${message}`)} />
    </div>
  );
};
