import React from "react";
import { useStoreActions, useStoreState } from "./../../hooks";
import {
  Alignment,
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
} from "@blueprintjs/core";
import { WalletUsername } from "./../../components/styled";
import { useHistory } from "react-router-dom";
import { LanguageMenuContainer } from "../common/LanguageMenu";

export const AccountNavBarContainer = () => {
  let history = useHistory();

  const { username, token } = useStoreState((state) => state.session);
  const { toggleSettings } = useStoreActions((actions) => actions.ui);
  const { logout } = useStoreActions((actions) => actions.session);

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Button
          minimal={true}
          icon="cog"
          onClick={() => {
            toggleSettings();
          }}
        />
        <img
          src={require("path").join(__dirname, "./statics/images/grin@2x.png")}
          alt=""
          style={{
            maxWidth: "35px",
            height: "auto",
          }}
        />
        <NavbarHeading>
          <WalletUsername>{username}</WalletUsername>
        </NavbarHeading>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT} className="bp3-dark">
        <Button
          minimal={true}
          icon="ip-address"
          onClick={() => history.push("/Status")}
        />
        <NavbarDivider />
        <LanguageMenuContainer />
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
              require("electron-log").info(
                `Trying to ReSync Blockchain: ${error}`
              );
            }
          }}
        />
      </NavbarGroup>
    </Navbar>
  );
};
