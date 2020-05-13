import React, { useCallback } from "react";
import { SettingsComponent } from "../../components/extras/Settings";
import { useStoreActions, useStoreState } from "../../hooks";
import { PasswordPromptComponent } from "../../components/wallet/open/PasswordPrompt";
import { useTranslation } from "react-i18next";
import { Toaster, Position, Intent, Alert } from "@blueprintjs/core";
import { WalletSeedInputComponent } from "../../components/shared/WalletSeedInput";
import { ISeed } from "../../interfaces/ISeed";

export const SettingsContainer = () => {
  const { t } = useTranslation();

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
  const { isLoggedIn, username: sessionUsername, seed } = useStoreState(
    (state) => state.session
  );
  const { username, password, waitingResponse } = useStoreState(
    (state) => state.passwordPrompt
  );

  const { setUsername, setPassword, setWaitingResponse } = useStoreActions(
    (state) => state.passwordPrompt
  );
  const { getWalletSeed, setSeed } = useStoreActions((state) => state.session);
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

  const backupSeed = useCallback(async () => {
    if (username === undefined || password === undefined) return;
    setWaitingResponse(true);
    try {
      const seed: string[] = await getWalletSeed({
        username: username,
        password: password,
      });
      if (seed !== undefined && seed.length > 0) {
        let _seed: ISeed[] = [];
        for (let index = 0; index < seed.length; index++) {
          const word = seed[index];
          _seed.push({
            position: index + 1,
            text: word,
            disabled: true,
            valid: true,
          });
        }
        setSeed(_seed);
      }
    } catch (error) {
      Toaster.create({ position: Position.BOTTOM }).show({
        message: error.message,
        intent: Intent.DANGER,
        icon: "warning-sign",
      });
    }
    setWaitingResponse(false);
  }, [getWalletSeed, username, password, setSeed]);

  return (
    <div>
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
        isConfirmationDialogOpen={isConfirmationDialogOpen}
        setGrinJoinUseCb={setGrinJoinUse}
        setGrinJoinAddressCb={setGrinJoinAddress}
        setMininumPeersCb={setMininumPeers}
        setMaximumPeersCb={setMaximumPeers}
        setConfirmationsCb={setConfirmations}
        toggleConfirmationDialogCb={toggleDialog}
        confirmReSyncBlockchainCb={confirmReSyncBlockchain}
        restartNodeCb={restartGrinNode}
        isLoggedIn={isLoggedIn}
        backupButtonCb={() => setUsername(sessionUsername)}
      />
      {isLoggedIn ? (
        <PasswordPromptComponent
          isOpen={username && username.length > 0 ? true : false}
          username={username ? username : ""}
          password={password ? password : ""}
          passwordCb={(value: string) => setPassword(value)}
          onCloseCb={() => {}}
          waitingResponse={waitingResponse}
          passwordButtonCb={backupSeed}
          connected={status.toLocaleLowerCase() !== "not connected"}
          buttonText={t("confirm_password")}
        />
      ) : null}
      {seed !== undefined ? (
        <Alert
          className="bp3-dark"
          canEscapeKeyCancel={true}
          canOutsideClickCancel={true}
          onConfirm={() => {
            setSeed(undefined);
            setUsername(undefined);
            setPassword(undefined);
          }}
          onCancel={() => {
            setSeed(undefined);
            setUsername(undefined);
            setPassword(undefined);
          }}
          isOpen={seed !== undefined}
          style={{ backgroundColor: "#050505" }}
        >
          <WalletSeedInputComponent
            seed={seed}
            onWordChangeCb={() => {}}
            length={seed.length}
          />
        </Alert>
      ) : null}
    </div>
  );
};
