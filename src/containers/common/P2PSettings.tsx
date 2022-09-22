import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { P2PSettingsComponent } from "../../components/extras/P2PSettings";

export const P2PSettingsContainer = () => {
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
    preferredPeers,
    allowedPeers,
    blockedPeers,
  } = useStoreState((state) => state.settings);

  const { username: sessionUsername } = useStoreState(
    (state) => state.session
  );

  const { setUsername: setPasswordPromptUsername } = useStoreActions(
    (state) => state.passwordPrompt
  );

  const {
    setAction: setWalletAction,
  } = useStoreActions((state) => state.wallet);

  const { toggleP2PSettings } = useStoreActions((actions) => actions.ui);

  return (
    <P2PSettingsComponent
      preferredPeers={preferredPeers.join("\n")}
      allowedPeers={allowedPeers.join("\n")}
      blockedPeers={blockedPeers.join("\n")}
      backupButtonCb={() => {
        toggleP2PSettings(false);
        setPasswordPromptUsername(sessionUsername);
        setWalletAction("backup");
      }}
    />
  );
};
