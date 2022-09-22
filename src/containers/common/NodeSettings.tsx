import React, { useCallback, useEffect } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { NodeSettingsComponent } from "../../components/extras/NodeSettings";

export const NodeSettingsContainer = () => {
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
    mininumPeers,
    maximumPeers,
    confirmations,
    isConfirmationDialogOpen,
  } = useStoreState((state) => state.settings);

  const { isLoggedIn, username: sessionUsername } = useStoreState(
    (state) => state.session
  );

  const { setUsername: setPasswordPromptUsername } = useStoreActions(
    (state) => state.passwordPrompt
  );
  const {
    setMininumPeers,
    setMaximumPeers,
    setConfirmations,
    toggleConfirmationDialog
  } = useStoreActions((actions) => actions.settings);

  const {
    reSyncBlockchain,
    setAction: setWalletAction,
  } = useStoreActions((state) => state.wallet);

  const { toggleNodeSettings } = useStoreActions((actions) => actions.ui);

  const toggleDialog = useCallback(() => {
    toggleConfirmationDialog();
  }, [toggleConfirmationDialog]);

  const confirmReSyncBlockchain = useCallback(async () => {
    toggleConfirmationDialog();
    require("electron-log").info("Trying to ReSync Blockchain...");
    try {
      await reSyncBlockchain();
    } catch (error) {
      require("electron-log").error(
        `Error trying to ReSync Blockchain: ${error.message}`
      );
    }
  }, [toggleConfirmationDialog, reSyncBlockchain]);

  return (
    <NodeSettingsComponent
      mininumPeers={mininumPeers}
      maximumPeers={maximumPeers}
      confirmations={confirmations}
      isConfirmationDialogOpen={isConfirmationDialogOpen}
      setMininumPeersCb={setMininumPeers}
      setMaximumPeersCb={setMaximumPeers}
      setConfirmationsCb={setConfirmations}
      toggleConfirmationDialogCb={toggleDialog}
      confirmReSyncBlockchainCb={() => {
        toggleNodeSettings(false);
        confirmReSyncBlockchain();
      }}
      backupButtonCb={() => {
        toggleNodeSettings(false);
        setPasswordPromptUsername(sessionUsername);
        setWalletAction("backup");
      }}
      isLoggedIn={isLoggedIn}

    />
  );
};
