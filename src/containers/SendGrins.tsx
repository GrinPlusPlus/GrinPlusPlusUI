import React, { useEffect } from "react";
import SendContainer from "./transaction/Send";
import { StatusBarContainer } from "./common/StatusBar";
import { Redirect, useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";
import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";

export default function SendGrinContainer() {
  let history = useHistory();
  const { token, isLoggedIn } = useStoreState((state) => state.session);
  const { updateSummaryInterval } = useStoreState(
    (state) => state.walletSummary
  );

  const { getWalletSummary } = useStoreActions(
    (actions) => actions.walletSummary
  );

  const { setInitialValues } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  useEffect(() => {
    async function init(t: string) {
      await getWalletSummary(t);
    }
    init(token);
    const interval = setInterval(async () => {
      await getWalletSummary(token);
    }, updateSummaryInterval);

    return () => clearInterval(interval);
  }, [getWalletSummary, token, updateSummaryInterval]);

  const { checkNodeHealth } = useStoreActions((actions) => actions.wallet);
  useEffect(() => {
    try {
      checkNodeHealth();
    } catch (error) {
      history.push("/error");
    }
  }, [checkNodeHealth, history]);
  return (
    <div data-testid="wallet">
      {!isLoggedIn ? <Redirect to="/login" /> : null}
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <Button
            minimal={true}
            icon="arrow-left"
            onClick={() => {
              setInitialValues();
              history.push("/wallet");
            }}
          />
          <NavbarDivider />
          <NavbarHeading>Send Grins ツ</NavbarHeading>
        </NavbarGroup>
      </Navbar>
      <div className="content">
        <SendContainer />
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </div>
  );
}
