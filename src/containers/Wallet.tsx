import React, { Suspense, useCallback } from "react";
import { OverlayToaster, Position, Intent, Alert } from "@blueprintjs/core";

import { ISeed } from "../interfaces/ISeed";
import { AlertComponent } from "../components/extras/Alert";
import { LoadingComponent } from "../components/extras/Loading";
import { PasswordPromptComponent } from "../components/wallet/open/PasswordPrompt";
import { WalletSeedInputComponent } from "../components/shared/WalletSeedInput";

import { useStoreActions, useStoreState } from "../hooks";
import { useInterval } from "../helpers";

import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

  const { isLoggedIn, seed, token, address } = useStoreState(
    (state) => state.session
  );
  const { alert } = useStoreState((state) => state.ui);
  const { status } = useStoreState((state) => state.nodeSummary);

  const { username, password, waitingResponse } = useStoreState(
    (state) => state.passwordPrompt
  );
  const { setUsername, setPassword, setWaitingResponse } = useStoreActions(
    (state) => state.passwordPrompt
  );
  const { setAlert } = useStoreActions((actions) => actions.ui);
  const { setSeed, updateWalletAddress } = useStoreActions((state) => state.session);
  const {
    updateWalletSummary,
    updateWalletBalance,
    setWalletReachable,
    checkWalletAvailability,
  } = useStoreActions((actions) => actions.walletSummary);

  const { action } = useStoreState((state) => state.wallet);
  const { setAction: setWalletAction, getWalletSeed } = useStoreActions(
    (state) => state.wallet
  );
  
  useInterval(async () => {
    if (token !== undefined && token.length > 0) {
      if (token.length === 0) return;
      try {
        await updateWalletAddress(token);
      } catch (error) {
        Log.error(`Error trying to get Wallet address: ${error.message}`);
      }
    }
  }, 3000);

  useInterval(async () => {
    if (token !== undefined && token.length > 0) {
      if (token.length === 0) return;
      try {
        await updateWalletBalance(token);
      } catch (error) {
        Log.error(`Error trying to get Wallet Balance: ${error.message}`);
      }
    }
  }, 4000);

  useInterval(async () => {
    if (token !== undefined && token.length > 0) {
      if (token.length === 0) return;
      try {
        await updateWalletSummary(token);
      } catch (error) {
        Log.error(`Error trying to get Wallet Summary: ${error.message}`);
      }
    }
  }, 4000);

  useInterval(async () => {
    if (!isLoggedIn) return;
    Log.info(`Testing wallet reachability...`);

    try {
      if (!isLoggedIn) return;
      if (!(await checkWalletAvailability(address))) {
        Log.error("Wallet is not reachable");
        setWalletReachable(false);
      } else {
        setWalletReachable(true);
        Log.info("Wallet is reachable");
      }
    } catch (error) {
      Log.error(`Error trying to get wallet reachability: ${error.message}`);
    }
  }, 40000);

  const backupSeed = useCallback(async () => {
    if (username === undefined || password === undefined) return;
    setWaitingResponse(true);
    try {
      const seed_tmp: string[] = await getWalletSeed({
        username: username,
        password: password,
      });
      if (seed_tmp !== undefined && seed_tmp.length > 0) {
        const _seed: ISeed[] = [];
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
      OverlayToaster.create({ position: Position.BOTTOM }).show({
        message: error.message,
        intent: Intent.DANGER,
        icon: "warning-sign",
      });
    }

    setWalletAction(undefined); // to close prompt
    setUsername(undefined); // to close prompt
    setWaitingResponse(false);
  }, [
    getWalletSeed,
    username,
    password,
    setSeed,
    setWaitingResponse,
    setUsername,
    setWalletAction,
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
          isOpen={action !== undefined && username !== undefined}
          username={username ? username : ""}
          password={password ? password : ""}
          passwordCb={(value: string) => setPassword(value)}
          onCloseCb={() => {
            setUsername(undefined);
            setPassword(undefined);
            setWalletAction(undefined);
          }}
          waitingResponse={waitingResponse}
          passwordButtonCb={action === "backup" ? backupSeed : undefined}
          connected={status.toLocaleLowerCase() !== "not connected"}
          buttonText={t("confirm_password")}
        />
      ) : null}
      {seed !== undefined ? (
        <Alert
          className="bp4-dark"
          canEscapeKeyCancel={true}
          canOutsideClickCancel={true}
          onConfirm={() => {
            setSeed(undefined);
            setUsername(undefined);
            setPassword(undefined);
            setWalletAction(undefined);
          }}
          onCancel={() => {
            setSeed(undefined);
            setUsername(undefined);
            setPassword(undefined);
            setWalletAction(undefined);
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
