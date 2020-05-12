import React, { Suspense, useCallback, useEffect } from "react";
import { Card, Icon, Intent, Position, Text, Toaster } from "@blueprintjs/core";
import { Redirect } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../hooks";

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

  const { updateWalletSummary } = useStoreActions(
    (actions) => actions.walletSummary
  );
  const { getAddress } = useStoreActions(
    (actions) => actions.receiveCoinsModel
  );

  useEffect(() => {
    (async function() {
      try {
        const accounts = await getAccounts();
        setAccounts(accounts);
      } catch (error) {
        require("electron-log").error(
          `Error trying to get Accounts: ${error.message}`
        );
      }
    })();
  });

  const onOpenWalletButtonClicked = useCallback(async () => {
    setWaitingResponse(true);
    try {
      const token = await login({
        username: username,
        password: password,
      });
      if (token !== undefined && token.length > 0) {
        require("electron-log").info(
          "User logged in... redirecting to Wallet..."
        );

        try {
          await updateWalletSummary(token);
        } catch (error) {
          require("electron-log").error(
            `Error trying to get Wallet Summary: ${error.message}`
          );
        }

        try {
          getAddress(token);
        } catch (error) {
          require("electron-log").error(
            `Error trying to get Wallet address: ${error.message}`
          );
        }
      }
    } catch (error) {
      Toaster.create({ position: Position.BOTTOM }).show({
        message: error.message,
        intent: Intent.DANGER,
        icon: "warning-sign",
      });
    }
    setWaitingResponse(false);
  }, [
    username,
    password,
    login,
    setWaitingResponse,
    getAddress,
    updateWalletSummary,
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
        renderLoader()
      ) : accounts.length === 0 ? (
        <NoAccountsComponent />
      ) : (
        <OpenWalletComponent
          username={username}
          password={password}
          accounts={getAccountsList(accounts)}
          passwordCb={(value: string) => setPassword(value)}
          overlayCb={() => {
            setUsername("");
            setPassword("");
          }}
          waitingResponse={waitingResponse}
          loginButtonCb={onOpenWalletButtonClicked}
          connected={status.toLocaleLowerCase() !== "not connected"}
        />
      )}
    </Suspense>
  );
};
