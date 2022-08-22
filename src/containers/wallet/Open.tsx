import React, { Suspense, useCallback, useEffect } from "react";
import { useStoreActions, useStoreState } from "../../hooks";
import {
  Card,
  Icon,
  Intent,
  Position,
  Text,
  OverlayToaster,
  ContextMenu,
  Menu,
  MenuItem,
} from "@blueprintjs/core";

import { LoadingComponent } from "../../components/extras/Loading";

import { User } from "@blueprintjs/icons";

import { Redirect } from "react-router-dom";

import { useTranslation } from "react-i18next";

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

  const {
    username,
    password,
    accounts,
    waitingResponse,
    action,
  } = useStoreState((state) => state.signinModel);
  const {
    setUsername,
    setPassword,
    login,
    deleteWallet,
    setWaitingResponse,
    setAction,
  } = useStoreActions((actions) => actions.signinModel);

  const { getAccounts, setAccounts } = useStoreActions(
    (actions) => actions.signinModel
  );

  useEffect(() => {
    (async function() {
      if (accounts !== undefined) return;
      try {
        setAccounts(await getAccounts());
      } catch (error) {
        require("electron-log").error(
          `Error trying to get Accounts: ${error.message}`
        );
      }
    })();
  });

  const onOpenWalletButtonClicked = useCallback(async () => {
    setWaitingResponse(true);
    if (action == "open_wallet") {
      await login({
        username: username,
        password: password,
      })
        .then(() => {
          require("electron-log").info(
            "User logged in... redirecting to Wallet..."
          );
        })
        .catch((error: { message: string }) => {
          OverlayToaster.create({ position: Position.BOTTOM }).show({
            message: error.message,
            intent: Intent.DANGER,
            icon: "warning-sign",
          });
        });
    } else if (action == "delete_wallet") {
      await deleteWallet({
        username: username,
        password: password,
      })
        .then(() => {
          require("electron-log").info("Wallet deleted.");
          setAccounts(undefined);
        })
        .catch((error: { message: string }) => {
          OverlayToaster.create({ position: Position.BOTTOM }).show({
            message: error.message,
            intent: Intent.DANGER,
            icon: "warning-sign",
          });
        });
    }
  }, [
    username,
    password,
    login,
    deleteWallet,
    setAccounts,
    setWaitingResponse,
  ]);

  const { t } = useTranslation();

  const getAccountsList = useCallback(
    (accounts: string[]) => {
      const buttons: JSX.Element[] = accounts?.map((account) => {
        return (
          <ContextMenu
            className="bp4-dark"
            content={
              <Menu>
                <MenuItem
                  text={t("delete_wallet")}
                  intent={Intent.DANGER}
                  onClick={() => {
                    setUsername(account);
                    setAction("delete_wallet");
                  }}
                />
              </Menu>
            }
          >
            <div key={account} style={{ margin: "10px" }}>
              <Card
                interactive={true}
                className="bp4-dark"
                onClick={() => {
                  setUsername(account);
                  setAction("open_wallet");
                }}
                style={{
                  width: "165px",
                  height: "75px",
                  backgroundColor: "#252D31",
                  textAlign: "center",
                }}
              >
                <div>
                  <Icon icon={<User />} style={{ marginBottom: "5px" }} />
                </div>
                <div>
                  <Text>{account}</Text>
                </div>
              </Card>
            </div>
          </ContextMenu>
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
          action={action}
          username={username}
          password={password}
          accounts={getAccountsList(accounts)}
          passwordCb={(value: string) => setPassword(value)}
          onCloseCb={() => {
            setUsername("");
            setPassword("");
            setAction(undefined);
          }}
          waitingResponse={waitingResponse}
          passwordButtonCb={onOpenWalletButtonClicked}
          connected={status.toLocaleLowerCase() !== "not connected"}
        />
      )}
    </Suspense>
  );
};
