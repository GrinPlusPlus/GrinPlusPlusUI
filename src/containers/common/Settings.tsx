import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { SettingsComponent } from "../../components/extras/Settings";

export const SettingsContainer = () => {
  const {
    mininumPeers,
    maximumPeers,
    confirmations,
    nodeDataPath,
    nodeBinaryPath,
    useGrinJoin,
    grinJoinAddress,
    grinChckAddress,
    isConfirmationDialogOpen,
  } = useStoreState((state) => state.settings);
  const { floonet } = useStoreState((state) => state.settings.defaultSettings);
  const { isLoggedIn, username: sessionUsername } = useStoreState(
    (state) => state.session
  );

  const { setUsername } = useStoreActions((state) => state.passwordPrompt);
  const {
    setMininumPeers,
    setMaximumPeers,
    setConfirmations,
    setGrinJoinUse,
    setGrinJoinAddress,
    toggleConfirmationDialog,
    setGrinChckAddress,
  } = useStoreActions((actions) => actions.settings);
  const { reSyncBlockchain, restartNode } = useStoreActions(
    (state) => state.wallet
  );
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
      require("electron-log").error(
        `Error trying to ReSync Blockchain: ${error}`
      );
    }
  }, [toggleConfirmationDialog, reSyncBlockchain]);

  const restartGrinNode = useCallback(async () => {
    await restartNode();
  }, [restartNode]);

  return (
    <SettingsComponent
      floonet={floonet}
      useGrinJoin={useGrinJoin}
      grinJoinAddress={grinJoinAddress}
      grinChckAddress={grinChckAddress}
      mininumPeers={mininumPeers}
      maximumPeers={maximumPeers}
      confirmations={confirmations}
      nodeDataPath={nodeDataPath}
      nodeBinaryPath={nodeBinaryPath}
      isConfirmationDialogOpen={isConfirmationDialogOpen}
      setGrinJoinUseCb={setGrinJoinUse}
      setGrinJoinAddressCb={setGrinJoinAddress}
      setGrinChckAddressCb={setGrinChckAddress}
      setMininumPeersCb={setMininumPeers}
      setMaximumPeersCb={setMaximumPeers}
      setConfirmationsCb={setConfirmations}
      toggleConfirmationDialogCb={toggleDialog}
      confirmReSyncBlockchainCb={confirmReSyncBlockchain}
      restartNodeCb={restartGrinNode}
      isLoggedIn={isLoggedIn}
      backupButtonCb={() => {
        toggleSettings(false);
        setUsername(sessionUsername);
      }}
    />
  );
};
