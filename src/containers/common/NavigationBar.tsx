import React from "react";
import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import { useHistory } from "react-router-dom";

type NavBarProps = {
  title: string;
};

export const NavigationBarContainer = ({ title }: NavBarProps) => {
  let history = useHistory();
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Button
          minimal={true}
          icon="arrow-left"
          onClick={() => history.goBack()}
        />
        <NavbarDivider />
        <NavbarHeading>{title}</NavbarHeading>
      </NavbarGroup>
    </Navbar>
  );
};
