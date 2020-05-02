import React, { useCallback } from "react";
import { SettingsComponent } from "../../components/extras/Settings";
import { useStoreActions, useStoreState } from "../../hooks";

export const SettingsContainer = () => {
  const {
    mininumPeers,
    maximumPeers,
    confirmations,
    nodeDataPath,
    nodeBinaryPath,
    useGrinJoin,
    grinJoinAddress,
    isConfirmationDialogOpen,
  } = useStoreState((state) => state.settings);
  const { status } = useStoreState((state) => state.nodeSummary);
  const { floonet } = useStoreState((state) => state.settings.defaultSettings);
  const { isNodeRunning } = useStoreState((state) => state.wallet);

  const {
    setMininumPeers,
    setMaximumPeers,
    setConfirmations,
    setGrinJoinUse,
    setGrinJoinAddress,
    toggleConfirmationDialog,
  } = useStoreActions((actions) => actions.settings);
  const { reSyncBlockchain, restartNode } = useStoreActions(
    (state) => state.wallet
  );

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

  const restartGrinNode = useCallback(() => {
    restartNode();
  }, [restartNode]);

  return (
    <SettingsComponent
      status={status}
      floonet={floonet}
      useGrinJoin={useGrinJoin}
      grinJoinAddress={grinJoinAddress}
      mininumPeers={mininumPeers}
      maximumPeers={maximumPeers}
      confirmations={confirmations}
      nodeDataPath={nodeDataPath}
      nodeBinaryPath={nodeBinaryPath}
      isNodeRunning={isNodeRunning}
      isConfirmationDialogOpen={isConfirmationDialogOpen}
      setGrinJoinUseCb={setGrinJoinUse}
      setGrinJoinAddressCb={setGrinJoinAddress}
      setMininumPeersCb={setMininumPeers}
      setMaximumPeersCb={setMaximumPeers}
      setConfirmationsCb={setConfirmations}
      toggleConfirmationDialogCb={toggleDialog}
      confirmReSyncBlockchainCb={confirmReSyncBlockchain}
      restartNodeCb={restartGrinNode}
    />
  );
};
