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
import { getResourcePath } from "../../helpers";
import { useHistory } from "react-router-dom";

export const AccountNavBarContainer = () => {
  let history = useHistory();

  const { username, token } = useStoreState((state) => state.session);
  const { toggleSettings } = useStoreActions((actions) => actions.ui);
  const { logout } = useStoreActions((actions) => actions.session);
  const { clearWalletReachable } = useStoreActions(
    (actions) => actions.walletSummary
  );

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <img
          src={getResourcePath("./statics/images/grinpp.png")}
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
          icon="console"
          onClick={() => history.push("/status")}
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
              clearWalletReachable();
              await logout(token);
              require("electron-log").info("Logged out!");
            } catch (error) {
              require("electron-log").info(
                `Trying to ReSync Blockchain: ${error}`
              );
            }
          }}
        />
        <NavbarDivider />
        <Button
          minimal={true}
          icon="lifesaver"
          onClick={() => history.push("/help")}
        />
      </NavbarGroup>
    </Navbar>
  );
};
