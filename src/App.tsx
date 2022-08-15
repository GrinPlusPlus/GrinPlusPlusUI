import "./App.scss";

import { Route, MemoryRouter as Router, Switch } from "react-router-dom";

import { InitializerContainer } from "./containers/Initializer";
import React from "react";
import { RestoreContainer } from "./containers/Recover";
import { SendGrinContainer } from "./containers/SendGrins";
import { ReceiveGrinContainer } from "./containers/ReceiveGrins";
import { SignInContainer } from "./containers/SignIn";
import { SignUpContainer } from "./containers/SignUp";
import { StatusContainer } from "./containers/Status";
import { HelpContainer } from "./containers/Help";
import { NodeLogsContainer } from "./containers/node/Logs";
import { WalletLogsContainer } from "./containers/wallet/Logs";
import { UILogsContainer } from "./containers/ui/Logs";
import { StoreProvider } from "easy-peasy";
import { WalletContainer } from "./containers/Wallet";
import store from "./store";
import { useInterval } from "./helpers";

const App: React.FC = () => {
  useInterval(async () => {
    if (!store.getState().wallet.isWalletInitialized) {
      store.getActions().nodeSummary.updateStatus(undefined);
      return;
    }
    try {
      store
        .getActions()
        .nodeSummary.updateStatus(
          await store.getActions().nodeSummary.checkStatus()
        );
    } catch (error) {
      require("electron-log").error(
        `Error trying to get Node Status: ${error.message}`
      );
      store.getActions().nodeSummary.updateStatus(undefined);
    }
  }, store.getState().nodeSummary.CheckStatusInterval);

  useInterval(async () => {
    try {
      if (!await store.getActions().wallet.checkNodeHealth()) {
        require("electron-log").error(
          "HealthCheck failed: Backend is not Running"
        );
      }
    } catch (error) {
      require("electron-log").error(`HealthCheck failed: ${error.message}`);
    }
  }, store.getState().nodeSummary.HealthCheckInterval);

  useInterval(async () => {
    if (store.getState().nodeSummary.status.toLowerCase() === "not connected")
      return;
    try {
      store
        .getActions()
        .nodeSummary.setConnectedPeers(
          await store.getActions().nodeSummary.getConnectedPeers()
        );
    } catch (error) {
      require("electron-log").error(
        `Error trying to get Connected Peers: ${error.message}`
      );
    }
  }, 5000);

  return (
    <StoreProvider store={store}>
      <Router>
        <Switch>
          <Route path="/wallet">
            <WalletContainer />
          </Route>
          <Route path="/send">
            <SendGrinContainer />
          </Route>
          <Route path="/receive">
            <ReceiveGrinContainer />
          </Route>
          <Route path="/create">
            <SignUpContainer />
          </Route>
          <Route path="/restore">
            <RestoreContainer />
          </Route>
          <Route path="/login">
            <SignInContainer />
          </Route>
          <Route path="/status">
            <StatusContainer />
          </Route>
          <Route path="/help">
            <HelpContainer />
          </Route>
          <Route path="/nodeLogs">
            <NodeLogsContainer />
          </Route>
          <Route path="/walletLogs">
            <WalletLogsContainer />
          </Route>
          <Route path="/UILogs">
            <UILogsContainer />
          </Route>
          <Route path="/">
            <InitializerContainer />
          </Route>
        </Switch>
      </Router>
    </StoreProvider>
  );
};

export default App;
