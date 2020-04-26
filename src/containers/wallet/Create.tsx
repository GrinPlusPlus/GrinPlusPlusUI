import CreateWalletComponent from '../../components/wallet/create/CreateWallet';
import React, { useCallback } from 'react';
import WalletSeedConfirmation from '../../components/wallet/create/ConfirmWalletSeed';
import { hideSeedWords } from '../../helpers';
import { Intent, Position, Toaster } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../hooks';

export default function CreateWalletContainer() {
  let history = useHistory();
  const {
    username,
    password,
    minPasswordLength,
    passwordConfirmation,
    generatedSeed,
    hiddenSeed,
    seedsMatched,
  } = useStoreState((state) => state.createWallet);
  const {
    setUsername,
    setPassword,
    setPasswordConfirmation,
    create,
    setHiddenSeed,
    setHiddenSeedWord,
  } = useStoreActions((actions) => actions.createWallet);
  const { status } = useStoreState((state) => state.nodeSummary);

  const onCreateWalletButtonClicked = useCallback(async () => {
    await create({ username: username, password: password }).catch(
      (error: { message: string }) => {
        Toaster.create({ position: Position.TOP }).show({
          message: error.message,
          intent: Intent.DANGER,
          icon: "warning-sign",
        });
      }
    );
  }, [username, password, create]);

  const onContinueButtonClicked = useCallback(async () => {
    if (hiddenSeed.length > 0 && seedsMatched) history.push("/wallet");
    setHiddenSeed(hideSeedWords({ seed: [...generatedSeed], words: 5 }));
  }, [generatedSeed, hiddenSeed, seedsMatched, history, setHiddenSeed]);

  const onWordChange = useCallback(
    (word: string, position: number) => {
      setHiddenSeedWord({
        word: word,
        position: position,
      });
    },
    [setHiddenSeedWord]
  );

  return (
    <CreateWalletComponent
      username={username}
      password={password}
      status={status}
      minPasswordLength={minPasswordLength}
      confirmation={passwordConfirmation}
      receivedSeed={generatedSeed}
      setUsernameCb={setUsername}
      setPasswordCb={setPassword}
      setConfirmationCb={setPasswordConfirmation}
      signUpButtonCb={onCreateWalletButtonClicked}
      SeedValidationComponent={
        <WalletSeedConfirmation
          seedsMatched={seedsMatched}
          receivedSeed={generatedSeed}
          partiallyHiddenSeed={hiddenSeed}
          onWordChangeCb={onWordChange}
          onButtonClickedCb={onContinueButtonClicked}
        />
      }
    />
  );
}
