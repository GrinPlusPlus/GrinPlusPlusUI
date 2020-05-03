import React from "react";
import store from "./store";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { InitializerContainer } from "./containers/Initializer";
import { RestoreContainer } from "./containers/Recover";
import { SendGrinContainer } from "./containers/SendGrins";
import { SignInContainer } from "./containers/SignIn";
import { SignUpContainer } from "./containers/SingUp";
import { StatusContainer } from "./containers/Status";
import { StoreProvider } from "easy-peasy";
import { WalletContainer } from "./containers/Wallet";
import "./App.scss";
import { useInterval } from "./helpers";

const App: React.FC = () => {
  useInterval(async () => {
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
      require("electron-log").info("Performing HealthCheck...");
      try {
        await store.getActions().wallet.checkNodeHealth();
        require("electron-log").info("HealthCheck passed, all good!");
      } catch (error) {
        require("electron-log").error(`HealthCheck failed: ${error.message}`);
      }
    }
  }, store.getState().nodeSummary.updateInterval);

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

  useInterval(async () => {
    const token = store.getState().session.token;
    if (token.length === 0) return;
    try {
      await store.getActions().walletSummary.updateWalletSummary(token);
    } catch (error) {
      require("electron-log").error(
        `Error trying to get Wallet Summary: ${error.message}`
      );
    }
  }, store.getState().walletSummary.updateSummaryInterval);

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
          <Route path="/">
            <InitializerContainer />
          </Route>
        </Switch>
      </Router>
    </StoreProvider>
  );
};

export default App;
