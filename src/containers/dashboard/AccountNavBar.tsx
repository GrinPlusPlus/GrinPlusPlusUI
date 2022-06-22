import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "./../../hooks";

import { LanguageMenuContainer } from "../common/LanguageMenu";
import React from "react";
import { WalletUsername } from "./../../components/styled";
import { useNavigate } from "react-router-dom";

export const AccountNavBarContainer = () => {
  const navigate = useNavigate();

  const { username, token } = useStoreState((state) => state.session);
  const { toggleSettings } = useStoreActions((actions) => actions.ui);
  const { logout } = useStoreActions((actions) => actions.session);

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>
          <WalletUsername>{username}</WalletUsername>
        </NavbarHeading>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT} className="bp4-dark">
        <Button
          minimal={true}
          icon="console"
          onClick={() =>  navigate("/status")}
        />
        <NavbarDivider />
        <LanguageMenuContainer />
        <NavbarDivider />
        <Button
          minimal={true}
          icon="cog"
          onClick={() => {
            toggleSettings(true);
          }}
        />
        <NavbarDivider />
        <Button
          minimal={true}
          large={true}
          icon="log-out"
          onClick={async () => {
            try {
              require("electron-log").info(`Trying to logout`);
              await logout(token);
              require("electron-log").info("Logged out!");
            } catch (error) {
              const message = error instanceof Error ? error.message : error;
              require("electron-log").info(`Trying to Logout: ${message}`);
            }
          }}
        />
        <NavbarDivider />
        <Button
          minimal={true}
          icon="lifesaver"
          onClick={() =>  navigate("/help")}
        />
      </NavbarGroup>
    </Navbar>
  );
};
