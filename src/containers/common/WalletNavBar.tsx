import React from "react";
import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
} from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { useStoreActions } from "../../hooks";

export const WalletNavBarContainer = () => {
  let history = useHistory();
  const { toggleSettings } = useStoreActions((actions) => actions.ui);

  return (
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
  );
};
