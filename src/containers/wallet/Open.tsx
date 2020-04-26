import NoAccountsComponent from '../../components/extras/NoAccounts';
import OpenWalletComponent from '../../components/wallet/open/OpenWallet';
import React, { useCallback, useEffect } from 'react';
import {
  Card,
  Icon,
  Intent,
  Position,
  Text,
  Toaster
  } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../hooks';

export default function OpenWalletContainer() {
  let history = useHistory();
  const {
    username,
    password,
    accounts,
    retryInterval,
    waitingResponse,
  } = useStoreState((state) => state.signinModel);
  const {
    setUsername,
    setPassword,
    login,
    getAccounts,
    setWaitingResponse,
  } = useStoreActions((actions) => actions.signinModel);

  useEffect(() => {
    async function fetchData() {
      await getAccounts();
    }
    if (accounts === undefined) fetchData();
    const interval = setInterval(async () => {
      if (accounts === undefined) fetchData();
    }, retryInterval);
    return () => clearInterval(interval);
  }, [getAccounts, accounts, retryInterval]);

  const onOpenWalletButtonClicked = useCallback(async () => {
    setWaitingResponse(true);
    await login({
      username: username,
      password: password,
    })
      .then((success: boolean) => {
        setWaitingResponse(false);
        history.push("/wallet");
      })
      .catch((error: { message: any }) => {
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
    <div>
      {accounts ? (
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
    </div>
  );
}
