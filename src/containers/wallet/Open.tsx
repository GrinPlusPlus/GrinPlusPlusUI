import { Card, Icon, Intent, Position, Text, Toaster } from "@blueprintjs/core";
import React, { Suspense, useCallback, useEffect } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { LoadingComponent } from "../../components/extras/Loading";
import { Redirect } from "react-router-dom";

const NoAccountsComponent = React.lazy(() =>
  import("../../components/extras/NoAccounts").then((module) => ({
    default: module.NoAccountsComponent,
  }))
);

const OpenWalletComponent = React.lazy(() =>
  import("../../components/wallet/open/OpenWallet").then((module) => ({
    default: module.OpenWalletComponent,
  }))
);

const renderLoader = () => null;

export const OpenWalletContainer = () => {
  const { status } = useStoreState((state) => state.nodeSummary);

  const { username, password, accounts, waitingResponse } = useStoreState(
    (state) => state.signinModel
  );
  const {
    setUsername,
    setPassword,
    login,
    setWaitingResponse,
  } = useStoreActions((actions) => actions.signinModel);

  const { getAccounts, setAccounts } = useStoreActions(
    (actions) => actions.signinModel
  );

  useEffect(() => {
    (async function() {
      if (accounts !== undefined) return;
      try {
        const _accounts = await getAccounts();
        setAccounts(_accounts);
      } catch (error) {
        require("electron-log").error(
          `Error trying to get Accounts: ${error.message}`
        );
      }
    })();
  });

  const onOpenWalletButtonClicked = useCallback(async () => {
    try {
      await login({
        username: username,
        password: password,
      }).then(() => {
        require("electron-log").info(
          "User logged in... redirecting to Wallet..."
        );
      }).catch((error: { message: string }) => {
        Toaster.create({ position: Position.BOTTOM }).show({
          message: error.message,
          intent: Intent.DANGER,
          icon: "warning-sign",
        });
      })
    } catch (error) { }
  }, [
    username,
    password,
    login,
    setWaitingResponse,
  ]);

  const getAccountsList = useCallback(
    (accounts: string[]) => {
      let buttons: JSX.Element[] = accounts?.map((account) => {
        return (
          <div key={account} style={{ margin: "10px" }}>
            <Card
              interactive={true}
              className="bp3-dark"
              onClick={() => setUsername(account)}
              style={{
                width: "165px",
                height: "75px",
                backgroundColor: "#252D31",
                textAlign: "center",
              }}
            >
              <div>
                <Icon icon="user" style={{ marginBottom: "5px" }} />
              </div>
              <div>
                <Text>{account}</Text>
              </div>
            </Card>
          </div>
        );
      });
      return buttons;
    },
    [setUsername]
  );
  const { isLoggedIn } = useStoreState((state) => state.session);

  return (
    <Suspense fallback={renderLoader()}>
      {isLoggedIn ? <Redirect to="/wallet" /> : null}
      {accounts === undefined ? (
        <LoadingComponent />
      ) : accounts.length === 0 ? (
        <NoAccountsComponent />
      ) : (
        <OpenWalletComponent
          username={username}
          password={password}
          accounts={getAccountsList(accounts)}
          passwordCb={(value: string) => setPassword(value)}
          onCloseCb={() => {
            setUsername("");
            setPassword("");
          }}
          waitingResponse={waitingResponse}
          passwordButtonCb={onOpenWalletButtonClicked}
          connected={status.toLocaleLowerCase() !== "not connected"}
        />
      )}
    </Suspense>
  );
};
