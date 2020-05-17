import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading
} from "@blueprintjs/core";

import React from "react";
import { useHistory } from "react-router-dom";

type NavBarProps = {
  title: string;
  onExit?: () => void;
};

export const NavigationBarContainer = ({ title, onExit }: NavBarProps) => {
  let history = useHistory();
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Button
          minimal={true}
          icon="arrow-left"
          onClick={() => {
            if (onExit) onExit();
            history.goBack();
          }}
        />
        <NavbarDivider />
        <NavbarHeading>{title}</NavbarHeading>
      </NavbarGroup>
    </Navbar>
  );
};
