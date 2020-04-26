import React, { useEffect } from 'react';
import SendContainer from './transaction/Send';
import SettingsContainer from './Settings';
import StatusBarContainer from './common/StatusBar';
import { Redirect, useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../hooks';
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

export default function SendGrinContainer() {
  let history = useHistory();
  const { token, isLoggedIn } = useStoreState((state) => state.session);
  const { showSettings } = useStoreState((state) => state.ui);
  const { toggleSettings } = useStoreActions((actions) => actions.ui);
  const { logout } = useStoreActions((actions) => actions.session);
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
        <SendContainer />
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
    </div>
  );
}
