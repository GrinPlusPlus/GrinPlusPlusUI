import LogoComponent from '../components/shared/Logo';
import React, { useEffect } from 'react';
import RestoreWalletContainer from './wallet/Restore';
import StatusBarContainer from './common/StatusBar';
import { Form, HorizontallyCenter } from '../components/styled';
import { useHistory } from 'react-router-dom';
import { useStoreActions } from '../hooks';
import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";

export default function RestoreContainer() {
  let history = useHistory();

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
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <Button
            minimal={true}
            icon="arrow-left"
            onClick={() => history.push("/login")}
          />
          <NavbarDivider />
          <NavbarHeading>Restore Wallet</NavbarHeading>
        </NavbarGroup>
      </Navbar>
      <div className="content">
        <HorizontallyCenter>
          <LogoComponent />
        </HorizontallyCenter>
        <Form>
          <RestoreWalletContainer />
        </Form>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </div>
  );
}
