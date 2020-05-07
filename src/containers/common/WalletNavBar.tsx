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
import { useTranslation } from "react-i18next";
import { LanguageMenuContainer } from "./LanguageMenu";

export const WalletNavBarContainer = () => {
  const { t } = useTranslation();

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
        <NavbarDivider />
        <Button
          minimal={true}
          icon="ip-address"
          onClick={() => history.push("/status")}
        />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          minimal={true}
          icon="build"
          text={t("create")}
          onClick={() => history.push("/create")}
        />
        <NavbarDivider />
        <Button
          minimal={true}
          icon="layers"
          text={t("restore")}
          onClick={() => history.push("/restore")}
        />
        <NavbarDivider />
        <LanguageMenuContainer />
      </NavbarGroup>
    </Navbar>
  );
};
