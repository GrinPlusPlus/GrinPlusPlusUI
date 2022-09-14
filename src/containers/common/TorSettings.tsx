import React, { useCallback, useEffect } from "react";
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

  const { toggleTorSettings } = useStoreActions((actions) => actions.ui);

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
    <TorSettingsComponent
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
        toggleTorSettings(false);
        confirmReSyncBlockchain();
      }}
      restartNodeCb={() => {
        toggleTorSettings(false);
        restartGrinNode();
      }}
      scanForOutputsCb={() => {
        toggleTorSettings(false);
        scanForOutputs();
      }}
      backupButtonCb={() => {
        toggleTorSettings(false);
        setPasswordPromptUsername(sessionUsername);
        setWalletAction("backup");
      }}
      isLoggedIn={isLoggedIn}

    />
  );
};
