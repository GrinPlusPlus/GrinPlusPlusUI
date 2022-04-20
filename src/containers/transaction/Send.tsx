import { Flex, SendGrinsContent } from "../../components/styled";
import React, { Suspense, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../hooks";

import {
  Button,
  Classes,
  Dialog,
  OverlayToaster,
  Position,
  Intent,
} from "@blueprintjs/core";

import { LoadingComponent } from "../../components/extras/Loading";
import { PasswordPromptComponent } from "../../components/wallet/open/PasswordPrompt";
import { useTranslation } from "react-i18next";
import { SlatepackComponent } from "../../components/extras/Slatepack";

const SpendableContainer = React.lazy(() =>
  import("./Spendable").then((module) => ({
    default: module.SpendableContainer,
  }))
);

const TransactionAmountContainer = React.lazy(() =>
  import("./TransactionAmount").then((module) => ({
    default: module.TransactionAmountContainer,
  }))
);

const TransactionAddressContainer = React.lazy(() =>
  import("./TransactionAddress").then((module) => ({
    default: module.TransactionAddressContainer,
  }))
);

const CoinControlContainer = React.lazy(() =>
  import("./CoinControl").then((module) => ({
    default: module.CoinControlContainer,
  }))
);

const SendUsingAddressContainer = React.lazy(() =>
  import("./SendUsingAddress").then((module) => ({
    default: module.SendUsingAddressContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const SendContainer = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { token } = useStoreState((state) => state.session);
  const { status } = useStoreState((state) => state.nodeSummary);
  const {
    username: usernamePrompt,
    password: passwordPrompt,
    waitingResponse: waitingForPassword,
  } = useStoreState((state) => state.passwordPrompt);

  const { spendable } = useStoreState((state) => state.walletSummary);

  const {
    amount,
    fee,
    returnedSlatepack,
    address,
    strategy,
    inputs,
  } = useStoreState((state) => state.sendCoinsModel);
  const { getOutputs, setReturnedSlatepack } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  const {
    setUsername: setUsernamePrompt,
    setPassword: setPasswordPrompt,
    setWaitingResponse: setWaitingResponsePrompt,
  } = useStoreActions((state) => state.passwordPrompt);

  const { getWalletSeed } = useStoreActions((state) => state.wallet);

  const { updateLogs } = useStoreActions((actions) => actions.wallet);

  const { sendGrins, setWaitingResponse } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  useEffect(() => {
    async function init(t: string) {
      await getOutputs(t).catch(() => {});
    }
    init(token);
  }, [getOutputs, token]);

  const onSendButtonClicked = useCallback(async () => {
    if (amount === undefined || amount.slice(-1) === ".") return;

    if (usernamePrompt === undefined) return;
    if (passwordPrompt === undefined) return;

    try {
      setWaitingResponsePrompt(true);
      await getWalletSeed({
        username: usernamePrompt,
        password: passwordPrompt,
      });
      setWaitingResponsePrompt(false);

      require("electron-log").info(`Trying to Send ${amount} to ${address}...`);
      updateLogs(`${t("sending")} ${amount} ツ...`);

      setUsernamePrompt(undefined); // to close prompt
      setPasswordPrompt(undefined); // to clean prompt
      setWaitingResponse(true);

      const sent = await sendGrins({
        amount: Number(amount) + fee === spendable ? undefined : amount,
        message: "",
        address: address,
        method: "FLUFF",
        grinJoinAddress: "",
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
        OverlayToaster.create({ position: Position.BOTTOM }).show({
          message: toast,
          intent: sent === "FINALIZED" ? Intent.SUCCESS : Intent.DANGER,
          icon: sent === "FINALIZED" ? "tick-circle" : "warning-sign",
        });
      }
      setWaitingResponse(false);
      updateLogs(toast);
      require("electron-log").info(toast);

      if (sent === "FINALIZED") navigate("/wallet");
    } catch (error: any) {
      setWaitingResponse(false);
      setWaitingResponsePrompt(false);
      require("electron-log").error(`Error sending: ${error.message}`);
      updateLogs(error);
      OverlayToaster.create({ position: Position.BOTTOM }).show({
        message: error.message,
        intent: Intent.DANGER,
        icon: "warning-sign",
      });
    }
  }, [
    sendGrins,
    amount,
    address,
    inputs,
    token,
    strategy,
    history,
    setWaitingResponse,
    t,
    updateLogs,
    setUsernamePrompt,
    setPasswordPrompt,
    spendable,
    fee,
    usernamePrompt,
    getWalletSeed,
    passwordPrompt,
    setWaitingResponsePrompt,
  ]);

  return (
    <Suspense fallback={renderLoader()}>
      <SendGrinsContent>
        <SpendableContainer />
        <Flex>
          <TransactionAmountContainer />
          <div style={{ marginLeft: "25px" }}>
            <SendUsingAddressContainer />
          </div>
        </Flex>
        <TransactionAddressContainer />
        <CoinControlContainer />
      </SendGrinsContent>
      {usernamePrompt ? (
        <PasswordPromptComponent
          isOpen={usernamePrompt && usernamePrompt.length > 0 ? true : false}
          username={usernamePrompt ? usernamePrompt : ""}
          password={passwordPrompt ? passwordPrompt : ""}
          passwordCb={(value: string) => {
            setPasswordPrompt(value);
          }}
          onCloseCb={() => {
            setUsernamePrompt(undefined);
            setPasswordPrompt(undefined);
          }}
          waitingResponse={waitingForPassword}
          passwordButtonCb={onSendButtonClicked}
          connected={status.toLocaleLowerCase() !== "not connected"}
          buttonText={t("confirm_password")}
        />
      ) : null}
      <Dialog
        title="Slatepack"
        icon="label"
        onClose={() => {
          setReturnedSlatepack("");
          navigate("/wallet");
        }}
        className="bp4-dark"
        isOpen={returnedSlatepack.length !== 0}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>{t("share_to_initiate_transaction")}</p>
          <br />
          <div>
            <SlatepackComponent slatepack={returnedSlatepack} />
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={() => {
                setReturnedSlatepack("");
                navigate("/wallet");
              }}
            >
              {t("close")}
            </Button>
          </div>
        </div>
      </Dialog>
    </Suspense>
  );
};
