import CreateWalletContainer from './wallet/Create';
import LogoComponent from '../components/shared/Logo';
import React, { useEffect } from 'react';
import StatusBar from './common/StatusBar';
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

export default function SignUpContainer() {
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
          <NavbarHeading>Create Wallet</NavbarHeading>
        </NavbarGroup>
      </Navbar>
      <div className="content">
        <HorizontallyCenter>
          <LogoComponent />
        </HorizontallyCenter>
        <Form>
          <CreateWalletContainer />
        </Form>
      </div>
      <div className="footer">
        <StatusBar />
      </div>
    </div>
  );
}
