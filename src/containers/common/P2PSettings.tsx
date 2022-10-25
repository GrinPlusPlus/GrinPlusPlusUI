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

  const { toggleP2PSettings } = useStoreActions((actions) => actions.ui);

  const { setPreferredPeers, setAllowedPeers, setBlockedPeers, updatePeferredPeers } = useStoreActions((actions) => actions.settings);

  return (
    <P2PSettingsComponent
      preferredPeers={preferredPeers}
      allowedPeers={allowedPeers}
      blockedPeers={blockedPeers}
      setPreferredPeersCb={setPreferredPeers}
      setAllowedPeersCb={setAllowedPeers}
      setBlockedPeersCb={setBlockedPeers}
      saveButtonCb={() => {
        updatePeferredPeers();
        toggleP2PSettings(false);
      }}
    />
  );
};
