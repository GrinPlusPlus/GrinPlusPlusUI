import ErrorContainer from "./containers/Error";
import InitializerContainer from "./containers/Initializer";
import React from "react";
import { RestoreContainer } from "./containers/Recover";
import { SendGrinContainer } from "./containers/SendGrins";
import { SignInContainer } from "./containers/SignIn";
import { SignUpContainer } from "./containers/SingUp";
import store from "./store";
import WalletContainer from "./containers/Wallet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { StoreProvider } from "easy-peasy";
import "./App.scss";

const App: React.FC = () => {
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
          <Route path="/error">
            <ErrorContainer />
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
