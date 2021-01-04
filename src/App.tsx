import "./App.scss";

import { Route, MemoryRouter as Router, Switch } from "react-router-dom";

import { InitializerContainer } from "./containers/Initializer";
import React from "react";
import { RestoreContainer } from "./containers/Recover";
import { SendGrinContainer } from "./containers/SendGrins";
import { SignInContainer } from "./containers/SignIn";
import { SignUpContainer } from "./containers/SingUp";
import { StatusContainer } from "./containers/Status";
import { HelpContainer } from "./containers/Help";
import { StoreProvider } from "easy-peasy";
import { WalletContainer } from "./containers/Wallet";
import store from "./store";
import { useInterval } from "./helpers";

const App: React.FC = () => {
  useInterval(async () => {
    if (!store.getState().wallet.isWalletInitialized) return;
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
      if (store.getState().wallet.isWalletInitialized) {
        try {
          require("electron-log").info("Performing HealthCheck...");
          if (await store.getActions().wallet.checkNodeHealth()) {
            require("electron-log").info("HealthCheck passed, all good!");
          } else {
            require("electron-log").info(
              "HealthCheck failed: Backend is not Running"
            );
          }
        } catch (error) {
          require("electron-log").error(`HealthCheck failed: ${error}`);
        }
      }
    }
  }, store.getState().nodeSummary.updateInterval, []);

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
  }, 5000, []);

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
          <Route path="/help">
            <HelpContainer />
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
