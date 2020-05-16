import classNames from 'classnames';
import React, { useCallback } from 'react';
import { PasswordPromptComponent } from '../../components/wallet/open/PasswordPrompt';
import { SendUsingAddressComponent } from '../../components/transaction/send/SendUsingAddress';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../hooks';
import { useTranslation } from 'react-i18next';
import {
  Intent,
  Position,
  Toaster,
  Classes,
  Overlay,
  Spinner,
  Text,
} from "@blueprintjs/core";

export const SendUsingAddressContainer = () => {
  const { t } = useTranslation();

  let history = useHistory();

  const { spendable } = useStoreState((state) => state.walletSummary);
  const {
    amount,
    message,
    strategy,
    inputs,
    address,
    waitingResponse,
    isAddressValid,
    fee,
  } = useStoreState((state) => state.sendCoinsModel);

  const { token, username } = useStoreState((state) => state.session);
  const { status } = useStoreState((state) => state.nodeSummary);
  const { sendUsingListener, setWaitingResponse } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );
  const { updateLogs } = useStoreActions((actions) => actions.wallet);

  const { useGrinJoin, grinJoinAddress } = useStoreState(
    (state) => state.settings
  );

  const {
    username: usernamePrompt,
    password: passwordPrompt,
    waitingResponse: waitingForPassword,
  } = useStoreState((state) => state.passwordPrompt);

  const {
    setUsername: setUsernamePrompt,
    setPassword: setPasswordPrompt,
  } = useStoreActions((state) => state.passwordPrompt);

  const onSendButtonClicked = useCallback(async () => {
    if (amount === undefined || amount.slice(-1) === ".") return;

    require("electron-log").info(`Trying to Send ${amount} to ${address}...`);
    updateLogs(`${t("sending")} ${amount} ツ...`);

    setWaitingResponse(true);

    const sent = await sendUsingListener({
      amount: Number(amount),
      message: message,
      address: address,
      method: useGrinJoin ? "JOIN" : "STEM",
      grinJoinAddress: grinJoinAddress,
      inputs: inputs,
      token: token,
      strategy: strategy,
    });

    const v3 = "[a-z2-7]{56}";
    const alert = new RegExp(`${v3}`).test(address)
      ? t("transaction_sent")
      : t("transaction_started");

    const toast = sent === "sent" ? alert : t(sent);

    Toaster.create({ position: Position.BOTTOM }).show({
      message: toast,
      intent: sent === "sent" ? Intent.SUCCESS : Intent.DANGER,
      icon: sent === "sent" ? "tick-circle" : "warning-sign",
    });

    setWaitingResponse(false);

    updateLogs(toast);
    require("electron-log").info(toast);

    if (sent === "sent") history.push("/wallet");
  }, [
    sendUsingListener,
    amount,
    message,
    address,
    inputs,
    token,
    useGrinJoin,
    grinJoinAddress,
    strategy,
    history,
    setWaitingResponse,
    t,
    updateLogs,
  ]);

  const classes = classNames("bp3-dark", Classes.CARD, Classes.ELEVATION_4);

  return (
    <div>
      <SendUsingAddressComponent
        spendable={spendable}
        amount={amount ? Number(amount) : 0}
        inputsSelected={inputs.length !== 0}
        isAddressValid={isAddressValid}
        onSendButtonClickedCb={() => setUsernamePrompt(username)}
        fee={fee}
      />
      <Overlay
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isOpen={waitingResponse}
        enforceFocus={true}
        autoFocus={true}
      >
        <div
          className={classes}
          style={{
            top: "50%",
            left: "50%",
            position: "fixed",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spinner size={Spinner.SIZE_SMALL} />
          <Text>{t("sending_wait")}</Text>
        </div>
      </Overlay>
      {usernamePrompt ? (
        <PasswordPromptComponent
          isOpen={usernamePrompt && usernamePrompt.length > 0 ? true : false}
          username={usernamePrompt ? usernamePrompt : ""}
          password={passwordPrompt ? passwordPrompt : ""}
          passwordCb={(value: string) => setPasswordPrompt(value)}
          onCloseCb={() => setUsernamePrompt(undefined)}
          waitingResponse={waitingForPassword}
          passwordButtonCb={onSendButtonClicked}
          connected={status.toLocaleLowerCase() !== "not connected"}
          buttonText={t("confirm_password")}
        />
      ) : null}
    </div>
  );
};
