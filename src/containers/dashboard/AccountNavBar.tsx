import React from "react";
import { useStoreActions, useStoreState } from "./../../hooks";
import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import { WalletUsername } from "./../../components/styled";

export const AccountNavBarContainer = () => {
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
          src={"/statics/images/grin@2x.png"}
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
          large={true}
          icon="log-out"
          onClick={() => {
            logout(token);
          }}
        />
      </NavbarGroup>
    </Navbar>
  );
};
