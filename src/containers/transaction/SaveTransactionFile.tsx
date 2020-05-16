import React, { useCallback } from 'react';
import { Intent, Position, Toaster } from '@blueprintjs/core';
import { PasswordPromptComponent } from '../../components/wallet/open/PasswordPrompt';
import { SaveTransactionFileComponent } from '../../components/transaction/send/SaveTransactionFile';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../hooks';
import { useTranslation } from 'react-i18next';

export const SaveTransactionFileContainer = () => {
  const { t } = useTranslation();
  let history = useHistory();

  const { spendable } = useStoreState((state) => state.walletSummary);
  const { amount, message, strategy, inputs, fee } = useStoreState(
    (state) => state.sendCoinsModel
  );
  const { token, username } = useStoreState((state) => state.session);
  const { status } = useStoreState((state) => state.nodeSummary);
  const { sendViaFile } = useStoreActions((actions) => actions.sendCoinsModel);

  const {
    username: usernamePrompt,
    password: passwordPrompt,
    waitingResponse: waitingForPassword,
  } = useStoreState((state) => state.passwordPrompt);

  const {
    setUsername: setUsernamePrompt,
    setPassword: setPasswordPrompt,
  } = useStoreActions((state) => state.passwordPrompt);

  const onSaveButtonClicked = useCallback(async () => {
    if (amount === undefined || amount.slice(-1) === ".") return;
    try {
      const sent = await sendViaFile({
        amount: Number(amount),
        strategy: strategy,
        inputs: inputs,
        message: message,
        token: token,
      }).catch((error: { message: string }) => {
        Toaster.create({ position: Position.BOTTOM }).show({
          message: error.message,
          intent: Intent.DANGER,
          icon: "warning-sign",
        });
      });
      if (sent) {
        history.push("/wallet");
      }
    } catch (error) { }
  }, [sendViaFile, amount, message, inputs, token, strategy, history]);

  return (
    <div>
      <SaveTransactionFileComponent
        spendable={spendable}
        fee={fee}
        amount={amount ? Number(amount) : 0}
        inputsSelected={inputs.length !== 0}
        onSaveButtonClickedCb={() => setUsernamePrompt(username)}
      />
      {usernamePrompt ? (
        <PasswordPromptComponent
          isOpen={usernamePrompt && usernamePrompt.length > 0 ? true : false}
          username={usernamePrompt ? usernamePrompt : ""}
          password={passwordPrompt ? passwordPrompt : ""}
          passwordCb={(value: string) => setPasswordPrompt(value)}
          onCloseCb={() => setUsernamePrompt(undefined)}
          waitingResponse={waitingForPassword}
          passwordButtonCb={onSaveButtonClicked}
          connected={status.toLocaleLowerCase() !== "not connected"}
          buttonText={t("confirm_password")}
        />
      ) : null}
    </div>
  );
};
