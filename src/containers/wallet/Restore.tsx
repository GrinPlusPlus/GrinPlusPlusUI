import { Position, OverlayToaster } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { Intent } from "@blueprintjs/core";
import { RecoverWalletComponent } from "./../../components/wallet/recover/RecoverWallet";
import { useNavigate } from "react-router-dom";

export const RestoreWalletContainer = () => {
  const navigate = useNavigate();

  const {
    username,
    password,
    seed,
    isSeedCompleted,
    seedLength,
  } = useStoreState((state) => state.restoreWallet);
  const {
    setUsername,
    setPassword,
    setSeedWord,
    restore,
    setSeedLength,
  } = useStoreActions((actions) => actions.restoreWallet);

  const { status } = useStoreState((state) => state.nodeSummary);

  const onButtonClicked = useCallback(async () => {
    require("electron-log").info("Trying to Restore Wallet...");
    try {
      await restore({ username: username, password: password, seed: seed });
      require("electron-log").info("Wallet Restored.");
      navigate("/wallet");
    } catch (error: any) {
      OverlayToaster.create({ position: Position.BOTTOM }).show({
        message: error.message,
        intent: Intent.DANGER,
        icon: "warning-sign",
      });
      require("electron-log").error(
        `Error trying to Restore Wallet: ${error.message}`
      );
    }
  }, [username, password, seed, restore, history]);

  const onWordChange = useCallback(
    (word: string, position: number) => {
      setSeedWord({ word: word, position: position - 1 });
    },
    [setSeedWord]
  );

  return (
    <RecoverWalletComponent
      username={username}
      password={password}
      seed={seed}
      isSeedCompleted={isSeedCompleted}
      seedLength={seedLength}
      status={status}
      setUsernameCb={setUsername}
      setPasswordCb={setPassword}
      setSeedLengthCb={setSeedLength}
      onWordChangeCb={onWordChange}
      onButtonClickedCb={onButtonClicked}
    />
  );
};
