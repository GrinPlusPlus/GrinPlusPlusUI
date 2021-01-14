import { Flex, SendGrinsContent } from "../../components/styled";
import React, { Suspense, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../hooks";

import { Button, Classes, Dialog } from "@blueprintjs/core";

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

const SendUsingAddressContainer = React.lazy(() =>
  import("./SendUsingAddress").then((module) => ({
    default: module.SendUsingAddressContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const SendContainer = () => {
  let history = useHistory();

  const { t } = useTranslation();

  const { token } = useStoreState((state) => state.session);
  const { status } = useStoreState((state) => state.nodeSummary);
  const {
    username: usernamePrompt,
    password: passwordPrompt,
    callback: promptCallback,
    waitingResponse: waitingForPassword,
  } = useStoreState((state) => state.passwordPrompt);

  const { returnedSlatepack } = useStoreState((state) => state.sendCoinsModel);
  const { getOutputs, setReturnedSlatepack } = useStoreActions(
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
  }, [getOutputs, token]);

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
        <TransactionMessageContainer />
        <CoinControlContainer />
      </SendGrinsContent>
      {usernamePrompt ? (
        <PasswordPromptComponent
          isOpen={usernamePrompt && usernamePrompt.length > 0 ? true : false}
          username={usernamePrompt ? usernamePrompt : ""}
          password={passwordPrompt ? passwordPrompt : ""}
          passwordCb={(value: string) => setPasswordPrompt(value)}
          onCloseCb={() => {
            setUsernamePrompt(undefined);
            setPasswordPrompt(undefined);
          }}
          waitingResponse={waitingForPassword}
          passwordButtonCb={promptCallback}
          connected={status.toLocaleLowerCase() !== "not connected"}
          buttonText={t("confirm_password")}
        />
      ) : null}
      <Dialog
        title="Slatepack"
        icon="label"
        onClose={() => {
          setReturnedSlatepack("");
          history.push("/wallet");
        }}
        className="bp3-dark"
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
                history.push("/wallet");
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
