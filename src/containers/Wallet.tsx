import React, { Suspense, useCallback } from "react";
import { useStoreActions, useStoreState } from "../hooks";

import { AlertComponent } from "../components/extras/Alert";
import { LoadingComponent } from "../components/extras/Loading";
import { Redirect } from "react-router-dom";
import { PasswordPromptComponent } from "../components/wallet/open/PasswordPrompt";
import { ISeed } from "../interfaces/ISeed";
import { Toaster, Position, Intent, Alert } from "@blueprintjs/core";
import { WalletSeedInputComponent } from "../components/shared/WalletSeedInput";
import { useTranslation } from "react-i18next";
import { useInterval } from "../helpers";
import Log from "electron-log";

const AccountNavBarContainer = React.lazy(() =>
  import("./dashboard/AccountNavBar").then((module) => ({
    default: module.AccountNavBarContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const WalletDrawer = React.lazy(() =>
  import("./common/WalletDrawer").then((module) => ({
    default: module.WalletDrawer,
  }))
);

const DashboardContainer = React.lazy(() =>
  import("./dashboard/Dashboard").then((module) => ({
    default: module.DashboardContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const WalletContainer = () => {
  const { t } = useTranslation();

  const { isLoggedIn, seed, token, address } = useStoreState((state) => state.session);
  const { alert } = useStoreState((state) => state.ui);
  const { status } = useStoreState((state) => state.nodeSummary);
  
  const { username, password, waitingResponse } = useStoreState(
    (state) => state.passwordPrompt
  );
  const { setUsername, setPassword, setWaitingResponse } = useStoreActions(
    (state) => state.passwordPrompt
  );
  const { setAlert } = useStoreActions((actions) => actions.ui);
  const { getWalletSeed, setSeed } = useStoreActions((state) => state.session);
  const {
    updateWalletSummary,
    updateWalletBalance,
    checkWalletAvailability,
  } = useStoreActions((actions) => actions.walletSummary);
  const { getAddress } = useStoreActions(
    (actions) => actions.receiveCoinsModel
  );

  useInterval(async () => {
    if (token !== undefined && token.length > 0) {
      if (token.length === 0) return;
      try {
        await updateWalletSummary(token);
      } catch (error) {
        Log.error(
          `Error trying to get Wallet Summary: ${error.message}`
        );
      }
      try {
        await updateWalletBalance(token);
      } catch (error) {
        Log.error(
          `Error trying to get Wallet Balance: ${error.message}`
        );
      }
    }
  }, 5000, [token]);
  
  useInterval(async () => {
    if (token.length === 0) return;

    let walletAddress = address;
    if (walletAddress.length !== 56) {
      try {
        Log.info("Checking address: " + token);
        walletAddress = await getAddress(token);
      } catch (error) {
        Log.error(
          `Error trying to get Wallet address: ${error.message}`
        );
      }
    }

    if (walletAddress.length === 56) {
      try {
        await checkWalletAvailability(walletAddress);
      } catch (error) {
        Log.error(
          `Error trying to get Wallet Availability: ${error.message}`
        );
      }
    }
  }, 30000, [token]);

  const backupSeed = useCallback(async () => {
    if (username === undefined || password === undefined) return;
    setWaitingResponse(true);
    try {
      const seed_tmp: string[] = await getWalletSeed({
        username: username,
        password: password,
      });
      if (seed_tmp !== undefined && seed_tmp.length > 0) {
        let _seed: ISeed[] = [];
        for (let index = 0; index < seed_tmp.length; index++) {
          const word = seed_tmp[index];
          _seed.push({
            position: index + 1,
            text: word,
            disabled: true,
            valid: true,
          });
        }
        setSeed(_seed);
      }
    } catch (error) {
      Toaster.create({ position: Position.BOTTOM }).show({
        message: error.message,
        intent: Intent.DANGER,
        icon: "warning-sign",
      });
    }
    setUsername(undefined); // to close prompt
    setWaitingResponse(false);
  }, [
    getWalletSeed,
    username,
    password,
    setSeed,
    setWaitingResponse,
    setUsername,
  ]);

  return (
    <Suspense fallback={renderLoader()}>
      {!isLoggedIn ? <Redirect to="/login" /> : null}
      <AccountNavBarContainer />
      <div className="content">
        <DashboardContainer />
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
      <WalletDrawer />
      <AlertComponent message={alert} setMessage={setAlert} />
      {isLoggedIn ? (
        <PasswordPromptComponent
          isOpen={username && username.length > 0 ? true : false}
          username={username ? username : ""}
          password={password ? password : ""}
          passwordCb={(value: string) => setPassword(value)}
          onCloseCb={() => {
            setUsername(undefined);
            setPassword(undefined);
          }}
          waitingResponse={waitingResponse}
          passwordButtonCb={backupSeed}
          connected={status.toLocaleLowerCase() !== "not connected"}
          buttonText={t("confirm_password")}
        />
      ) : null}
      {seed !== undefined ? (
        <Alert
          className="bp3-dark"
          canEscapeKeyCancel={true}
          canOutsideClickCancel={true}
          onConfirm={() => {
            setSeed(undefined);
            setUsername(undefined);
            setPassword(undefined);
          }}
          onCancel={() => {
            setSeed(undefined);
            setUsername(undefined);
            setPassword(undefined);
          }}
          isOpen={seed !== undefined}
          style={{ backgroundColor: "#050505" }}
        >
          <WalletSeedInputComponent
            seed={seed}
            onWordChangeCb={() => {}}
            length={seed.length}
          />
        </Alert>
      ) : null}
    </Suspense>
  );
};
