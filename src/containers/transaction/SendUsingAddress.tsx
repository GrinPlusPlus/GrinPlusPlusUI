import {
  Classes,
  Intent,
  Overlay,
  Position,
  Spinner,
  Text,
  Toaster,
} from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { SendUsingAddressComponent } from "../../components/transaction/send/SendUsingAddress";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const SendUsingAddressContainer = () => {
  const { t } = useTranslation();
  let history = useHistory();

  const { token } = useStoreState((state) => state.session);
  const { amount, message, strategy, inputs, address } = useStoreState(
    (state) => state.sendCoinsModel
  );
  const { useGrinJoin, grinJoinAddress } = useStoreState(
    (state) => state.settings
  );

  const {
    setUsername: setUsernamePrompt,
    setPassword: setPasswordPrompt,
    setCallback: setCallbackPrompt,
  } = useStoreActions((state) => state.passwordPrompt);
  const { sendUsingListener, setWaitingResponse } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );
  const { updateLogs } = useStoreActions((actions) => actions.wallet);

  const onSendButtonClicked = useCallback(async () => {
    if (amount === undefined || amount.slice(-1) === ".") return;

    require("electron-log").info(`Trying to Send ${amount} to ${address}...`);
    updateLogs(`${t("sending")} ${amount} ツ...`);

    setUsernamePrompt(undefined); // to close prompt
    setPasswordPrompt(undefined); // to clean prompt
    setWaitingResponse(true);

    try {
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

      const toast = sent === "FINALIZED" ? alert : t(sent);

      if (sent !== "SENT") {
        Toaster.create({ position: Position.BOTTOM }).show({
          message: toast,
          intent: sent === "FINALIZED" ? Intent.SUCCESS : Intent.DANGER,
          icon: sent === "FINALIZED" ? "tick-circle" : "warning-sign",
        });
      }
      setWaitingResponse(false);
      updateLogs(toast);
      require("electron-log").info(toast);

      if (sent === "FINALIZED") history.push("/wallet");
    } catch (error) {
      setWaitingResponse(false);
      require("electron-log").error(`Error sending: ${error}`);
      updateLogs(error);
      Toaster.create({ position: Position.BOTTOM }).show({
        message: error,
        intent: Intent.DANGER,
        icon: "warning-sign",
      });
    }
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
    setUsernamePrompt,
    setPasswordPrompt,
  ]);

  const { spendable } = useStoreState((state) => state.walletSummary);
  const { waitingResponse, isAddressValid, fee } = useStoreState(
    (state) => state.sendCoinsModel
  );
  const { username } = useStoreState((state) => state.session);

  const classes = classNames("bp3-dark", Classes.CARD, Classes.ELEVATION_4);

  return (
    <div>
      <SendUsingAddressComponent
        spendable={spendable}
        amount={amount ? Number(amount) : 0}
        inputsSelected={inputs.length !== 0}
        isAddressValid={isAddressValid}
        onSendButtonClickedCb={() => {
          setUsernamePrompt(username);
          setCallbackPrompt(onSendButtonClicked);
        }}
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
    </div>
  );
};
