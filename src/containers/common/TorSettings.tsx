import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { TorSettingsComponent } from "../../components/extras/TorSettings";

export const TorSettingsContainer = () => {
  const { getNodeSettings } = useStoreActions((actions) => actions.settings);

  useEffect(() => {
    (async function () {
      const log = require("electron-log");
      try {
        await getNodeSettings();
      } catch (error) {
        log.error(
          `Error trying to get Node Settings from the Backend: ${error.message}`
        );
      }
    })();
  }, [getNodeSettings]);

  const {
    shouldReuseAddress
  } = useStoreState((state) => state.settings);

  const { isLoggedIn, username: sessionUsername } = useStoreState(
    (state) => state.session
  );

  const { setUsername: setPasswordPromptUsername } = useStoreActions(
    (state) => state.passwordPrompt
  );
  
  const {
    setAction: setWalletAction,
  } = useStoreActions((state) => state.wallet);

  const { toggleTorSettings } = useStoreActions((actions) => actions.ui);

 
  return (
    <TorSettingsComponent
      shouldReuseAddress={shouldReuseAddress}
      backupButtonCb={() => {
        toggleTorSettings(false);
        setPasswordPromptUsername(sessionUsername);
        setWalletAction("backup");
      }}
      isLoggedIn={isLoggedIn}

    />
  );
};
