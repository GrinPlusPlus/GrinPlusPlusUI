import { AlertComponent } from "../components/extras/Alert";
import DashboardContainer from "./dashboard/Dashboard";
import React, { useEffect } from "react";
import { SettingsContainer } from "./common/Settings";
import { StatusBarContainer } from "./common/StatusBar";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";
import { WalletUsername } from "../components/styled";
import {
  Alignment,
  Button,
  Drawer,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Position,
} from "@blueprintjs/core";

export default function WalletContainer() {
  let history = useHistory();

  const { username, token, address, isLoggedIn } = useStoreState(
    (state) => state.session
  );
  const { showSettings, alert } = useStoreState((state) => state.ui);
  const { toggleSettings, setAlert } = useStoreActions((actions) => actions.ui);

  const { logout } = useStoreActions((actions) => actions.session);
  const { updateSummaryInterval } = useStoreState(
    (state) => state.walletSummary
  );

  const { getWalletSummary } = useStoreActions(
    (actions) => actions.walletSummary
  );
  const { retryInterval } = useStoreState(
    (actions) => actions.receiveCoinsModel
  );
  const { getAddress } = useStoreActions(
    (actions) => actions.receiveCoinsModel
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

  useEffect(() => {
    async function init(t: string) {
      await getAddress(t);
    }
    if (address.length !== 56) {
      init(token);
      const interval = setInterval(async () => {
        await getAddress(token);
      }, retryInterval);
      return () => clearInterval(interval);
    }
  }, [address, getAddress, token, retryInterval]);

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
          <img
            src={"/statics/images/grin@2x.png"}
            alt=""
            style={{
              maxWidth: "35px",
              height: "auto",
            }}
          />{" "}
          <NavbarHeading>
            <WalletUsername>{username}</WalletUsername>
          </NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT} className="bp3-dark">
          <Button
            minimal={true}
            large={true}
            icon="cog"
            onClick={() => {
              toggleSettings();
            }}
          />
          <NavbarDivider />
          <Button
            minimal={true}
            large={true}
            icon="log-out"
            onClick={() => {
              logout(token);
            }}
          />
        </NavbarGroup>
      </Navbar>
      <div className="content">
        <DashboardContainer />
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
      <Drawer
        className="bp3-dark"
        position={Position.RIGHT}
        icon="cog"
        onClose={() => {
          toggleSettings();
        }}
        title="Settings"
        isOpen={showSettings}
        size={Drawer.SIZE_STANDARD}
      >
        <SettingsContainer />
      </Drawer>
      <AlertComponent message={alert} setMessage={setAlert} />
    </div>
  );
}
