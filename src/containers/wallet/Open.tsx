import React, { useCallback, Suspense } from "react";
import { Card, Icon, Intent, Position, Text, Toaster } from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../hooks";
import { LoadingComponent } from "../../components/extras/Loading";

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

const renderLoader = () => <LoadingComponent />;

export const OpenWalletContainer = () => {
  let history = useHistory();
  const { username, password, accounts, waitingResponse } = useStoreState(
    (state) => state.signinModel
  );
  const {
    setUsername,
    setPassword,
    login,
    setWaitingResponse,
  } = useStoreActions((actions) => actions.signinModel);

  const onOpenWalletButtonClicked = useCallback(async () => {
    setWaitingResponse(true);
    await login({
      username: username,
      password: password,
    })
      .then((success: boolean) => {
        require("electron-log").info(
          "User logged in... redirecting to Wallet..."
        );
        setWaitingResponse(false);
        history.push("/wallet");
      })
      .catch((error: { message: any }) => {
        require("electron-log").info(error.message);
        Toaster.create({ position: Position.TOP }).show({
          message: error.message,
          intent: Intent.DANGER,
          icon: "warning-sign",
        });
        setWaitingResponse(false);
      });
  }, [username, password, login, history, setWaitingResponse]);

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

  return (
    <Suspense fallback={renderLoader()}>
      {accounts !== undefined && accounts?.length > 1 ? (
        <OpenWalletComponent
          username={username}
          password={password}
          accounts={getAccountsList(accounts)}
          passwordCb={(value: string) => setPassword(value)}
          olverlayCb={() => {
            setUsername("");
            setPassword("");
          }}
          waitingResponse={waitingResponse}
          loginButtonCb={onOpenWalletButtonClicked}
        />
      ) : (
        <NoAccountsComponent />
      )}
    </Suspense>
  );
};
