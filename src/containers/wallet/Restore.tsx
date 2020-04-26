import React, { useCallback } from 'react';
import RecoverWalletComponent from '../../components/wallet/recover/RecoverWallet';
import { Intent } from '@blueprintjs/core';
import { Position, Toaster } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../hooks';

export default function RestoreWalletContainer() {
  let history = useHistory();

  const {
    username,
    password,
    seed,
    isSeedCompleted,
    seedLength
  } = useStoreState(state => state.restoreWallet);
  const {
    setUsername,
    setPassword,
    setSeedWord,
    restore,
    setSeedLength
  } = useStoreActions(actions => actions.restoreWallet);

  const { status } = useStoreState(state => state.nodeSummary);

  const onButtonClicked = useCallback(async () => {
    await restore({ username: username, password: password, seed: seed })
      .then(() => history.push("/wallet"))
      .catch((error: { message: string }) =>
        Toaster.create({ position: Position.TOP }).show({
          message: error.message,
          intent: Intent.DANGER,
          icon: "warning-sign"
        })
      );
  }, [username, password, seed, restore, history]);

  const onWordChange = useCallback(
    (word: string, position: number) => {
      setSeedWord({ word: word, position: position });
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
}
