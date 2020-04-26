import GrinPPBannerComponent from '../components/shared/GrinPPBanner';
import OpenWalletContainer from './wallet/Open';
import React, { useEffect } from 'react';
import SettingsContainer from './Settings';
import StatusBarContainer from './common/StatusBar';
import { HorizontallyCenter } from '../components/styled';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../hooks';
import {
  Alignment,
  Button,
  Drawer,
  Navbar,
  NavbarDivider,
  NavbarGroup,
} from "@blueprintjs/core";

export default function SignInContainer() {
  let history = useHistory();

  const { showSettings } = useStoreState((state) => state.ui);
  const { toggleSettings } = useStoreActions((actions) => actions.ui);

  const { checkNodeHealth } = useStoreActions((actions) => actions.wallet);
  useEffect(() => {
    try {
      checkNodeHealth();
    } catch (error) {
      history.push("/error");
    }
  }, [checkNodeHealth, history]);

  return (
    <div>
      <Navbar className="bp3-dark">
        <NavbarGroup align={Alignment.LEFT}>
          <Button
            minimal={true}
            icon="cog"
            onClick={() => {
              toggleSettings();
            }}
          />
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <Button
            minimal={true}
            icon="build"
            text="Create"
            onClick={() => history.push("/create")}
          />
          <NavbarDivider />
          <Button
            minimal={true}
            icon="heatmap"
            text="Restore"
            onClick={() => history.push("/restore")}
          />
        </NavbarGroup>
      </Navbar>
      <div className="content">
        <HorizontallyCenter>
          <GrinPPBannerComponent />
        </HorizontallyCenter>
        <br />
        <HorizontallyCenter>
          <OpenWalletContainer />
        </HorizontallyCenter>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
      <Drawer
        className="bp3-dark"
        transitionDuration={0}
        position="left"
        icon="cog"
        onClose={() => {
          toggleSettings();
        }}
        title="Settings"
        isOpen={showSettings}
        size={Drawer.SIZE_SMALL}
      >
        <SettingsContainer />
      </Drawer>
    </div>
  );
}
