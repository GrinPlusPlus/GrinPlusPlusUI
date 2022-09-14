import React, { useCallback, useEffect } from "react";
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
    mininumPeers,
    maximumPeers,
    confirmations,
    shouldReuseAddress,
    preferredPeers,
    allowedPeers,
    blockedPeers,
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
    restartNode,
    scanForOutputs,
    setAction: setWalletAction,
  } = useStoreActions((state) => state.wallet);

  const { toggleP2PSettings } = useStoreActions((actions) => actions.ui);

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

  const restartGrinNode = useCallback(async () => {
    await restartNode();
  }, [restartNode]);

  return (
    <P2PSettingsComponent
      mininumPeers={mininumPeers}
      maximumPeers={maximumPeers}
      confirmations={confirmations}
      shouldReuseAddress={shouldReuseAddress}
      preferredPeers={preferredPeers.join("\n")}
      allowedPeers={allowedPeers.join("\n")}
      blockedPeers={blockedPeers.join("\n")}
      isConfirmationDialogOpen={isConfirmationDialogOpen}
      setMininumPeersCb={setMininumPeers}
      setMaximumPeersCb={setMaximumPeers}
      setConfirmationsCb={setConfirmations}
      toggleConfirmationDialogCb={toggleDialog}
      confirmReSyncBlockchainCb={() => {
        toggleP2PSettings(false);
        confirmReSyncBlockchain();
      }}
      restartNodeCb={() => {
        toggleP2PSettings(false);
        restartGrinNode();
      }}
      scanForOutputsCb={() => {
        toggleP2PSettings(false);
        scanForOutputs();
      }}
      backupButtonCb={() => {
        toggleP2PSettings(false);
        setPasswordPromptUsername(sessionUsername);
        setWalletAction("backup");
      }}
      isLoggedIn={isLoggedIn}

    />
  );
};
