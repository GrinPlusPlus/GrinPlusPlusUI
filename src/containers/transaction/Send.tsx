import React, { useEffect, Suspense, useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";
import {
  Left,
  SendGrinsContent,
  SendGrinTopRow,
} from "../../components/styled";
import { LoadingComponent } from "../../components/extras/Loading";
import { useTranslation } from "react-i18next";
import { PasswordPromptComponent } from "../../components/wallet/open/PasswordPrompt";

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

const SaveTransactionFileContainer = React.lazy(() =>
  import("./SaveTransactionFile").then((module) => ({
    default: module.SaveTransactionFileContainer,
  }))
);

const TransactionMessageContainer = React.lazy(() =>
  import("./TransactionMessage").then((module) => ({
    default: module.TransactionMessageContainer,
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

const renderLoader = () => <LoadingComponent />;

export const SendContainer = () => {
  const { t } = useTranslation();

  const { token } = useStoreState((state) => state.session);
  const { status } = useStoreState((state) => state.nodeSummary);
  const {
    username: usernamePrompt,
    password: passwordPrompt,
    callback: promptCallback,
    waitingResponse: waitingForPassword,
  } = useStoreState((state) => state.passwordPrompt);

  const { getOutputs, setInitialValues } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );
  const {
    setUsername: setUsernamePrompt,
    setPassword: setPasswordPrompt,
  } = useStoreActions((state) => state.passwordPrompt);

  useEffect(() => {
    async function init(t: string) {
      await getOutputs(t).catch(() => {});
    }
    init(token);
  }, [getOutputs, token, setInitialValues]);

  return (
    <Suspense fallback={renderLoader()}>
      <SendGrinsContent>
        <div style={{ float: "right" }}>
          <SpendableContainer />
        </div>
        <SendGrinTopRow>
          <Left>
            <TransactionAmountContainer />
          </Left>
          <div style={{ textAlign: "right", paddingRight: "5px" }}>
            <SaveTransactionFileContainer />
          </div>
        </SendGrinTopRow>
        <TransactionMessageContainer />
        <TransactionAddressContainer />
        <CoinControlContainer />
      </SendGrinsContent>
      {usernamePrompt ? (
        <PasswordPromptComponent
          isOpen={usernamePrompt && usernamePrompt.length > 0 ? true : false}
          username={usernamePrompt ? usernamePrompt : ""}
          password={passwordPrompt ? passwordPrompt : ""}
          passwordCb={(value: string) => setPasswordPrompt(value)}
          onCloseCb={() => setUsernamePrompt(undefined)}
          waitingResponse={waitingForPassword}
          passwordButtonCb={promptCallback}
          connected={status.toLocaleLowerCase() !== "not connected"}
          buttonText={t("confirm_password")}
        />
      ) : null}
    </Suspense>
  );
};
