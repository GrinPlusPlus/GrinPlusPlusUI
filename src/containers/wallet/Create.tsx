import { Intent, Position, Toaster } from "@blueprintjs/core";
import React, { Suspense, useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { hideSeedWords } from "../../helpers";
import { useHistory } from "react-router-dom";

const CreateWalletComponent = React.lazy(() =>
  import("./../../components/wallet/create/CreateWallet").then((module) => ({
    default: module.CreateWalletComponent,
  }))
);

const WalletSeedConfirmation = React.lazy(() =>
  import("./../../components/wallet/create/ConfirmWalletSeed").then(
    (module) => ({
      default: module.WalletSeedConfirmation,
    })
  )
);

const renderLoader = () => null;

export const CreateWalletContainer = () => {
  let history = useHistory();
  const {
    username,
    password,
    minPasswordLength,
    passwordConfirmation,
    generatedSeed,
    hiddenSeed,
    seedsMatched,
    seedLength,
  } = useStoreState((state) => state.createWallet);
  const {
    setUsername,
    setPassword,
    setPasswordConfirmation,
    create,
    setHiddenSeed,
    setHiddenSeedWord,
    setGeneratedSeed,
    setSeedLength,
  } = useStoreActions((actions) => actions.createWallet);
  const { status } = useStoreState((state) => state.nodeSummary);

  const onCreateWalletButtonClicked = useCallback(async () => {
    try {
      await create({
        username: username,
        password: password,
        seedLength: seedLength,
      })
        .then(() => {
          require("electron-log").info(
            "User created... redirecting to Wallet..."
          );
        })
        .catch((error: { message: string }) => {
          Toaster.create({ position: Position.BOTTOM }).show({
            message: error.message,
            intent: Intent.DANGER,
            icon: "warning-sign",
          });
        });
    } catch (error) {}
  }, [username, password, create, seedLength]);

  const onContinueButtonClicked = useCallback(async () => {
    if (hiddenSeed.length > 0 && seedsMatched) {
      setUsername("");
      setPassword("");
      setPasswordConfirmation("");
      setHiddenSeed([]);
      setGeneratedSeed([]);
      history.push("/wallet");
    }
    setHiddenSeed(hideSeedWords({ seed: [...generatedSeed], words: 5 }));
  }, [
    generatedSeed,
    hiddenSeed,
    seedsMatched,
    history,
    setHiddenSeed,
    setUsername,
    setPassword,
    setGeneratedSeed,
    setPasswordConfirmation,
  ]);

  const onWordChange = useCallback(
    (word: string, position: number) => {
      setHiddenSeedWord({
        word: word,
        position: position,
      });
    },
    [setHiddenSeedWord]
  );

  const onSeedLengthChange = useCallback(
    (length: string) => {
      setSeedLength(length);
    },
    [setSeedLength]
  );

  return (
    <Suspense fallback={renderLoader()}>
      <CreateWalletComponent
        username={username}
        password={password}
        status={status}
        minPasswordLength={minPasswordLength}
        confirmation={passwordConfirmation}
        seedLength={seedLength}
        setSeedLengthCb={onSeedLengthChange}
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
    </Suspense>
  );
};
