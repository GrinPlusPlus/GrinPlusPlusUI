import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { SettingsComponent } from "../../components/extras/Settings";

export const SettingsContainer = () => {
  const {
    mininumPeers,
    maximumPeers,
    confirmations,
    grinChckAddress,
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
    toggleConfirmationDialog,
    setGrinChckAddress,
  } = useStoreActions((actions) => actions.settings);

  const {
    reSyncBlockchain,
    restartNode,
    scanForOutputs,
    setAction: setWalletAction,
  } = useStoreActions((state) => state.wallet);

  const { toggleSettings } = useStoreActions((actions) => actions.ui);

  const toggleDialog = useCallback(() => {
    toggleConfirmationDialog();
  }, [toggleConfirmationDialog]);

  const confirmReSyncBlockchain = useCallback(async () => {
    toggleConfirmationDialog();
    require("electron-log").info("Trying to ReSync Blockchain...");
    try {
      await reSyncBlockchain();
    } catch (error) {
      const message = error instanceof Error ? error.message : error;
      require("electron-log").error(
        `Error trying to ReSync Blockchain: ${message}`
      );
    }
  }, [toggleConfirmationDialog, reSyncBlockchain]);

  const restartGrinNode = useCallback(async () => {
    await restartNode();
  }, [restartNode]);

  return (
    <SettingsComponent
      grinChckAddress={grinChckAddress}
      mininumPeers={mininumPeers}
      maximumPeers={maximumPeers}
      confirmations={confirmations}
      isConfirmationDialogOpen={isConfirmationDialogOpen}
      setGrinChckAddressCb={setGrinChckAddress}
      setMininumPeersCb={setMininumPeers}
      setMaximumPeersCb={setMaximumPeers}
      setConfirmationsCb={setConfirmations}
      toggleConfirmationDialogCb={toggleDialog}
      confirmReSyncBlockchainCb={() => {
        toggleSettings(false);
        confirmReSyncBlockchain();
      }}
      restartNodeCb={() => {
        toggleSettings(false);
        restartGrinNode();
      }}
      scanForOutputsCb={() => {
        toggleSettings(false);
        scanForOutputs();
      }}
      isLoggedIn={isLoggedIn}
      backupButtonCb={() => {
        toggleSettings(false);
        setPasswordPromptUsername(sessionUsername);
        setWalletAction("backup");
      }}
    />
  );
};
