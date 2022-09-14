import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
} from "@blueprintjs/core";

import { LanguageMenuContainer } from "./LanguageMenu";
import React from "react";
import { useHistory } from "react-router-dom";
import { useStoreActions } from "../../hooks";
import { useTranslation } from "react-i18next";

export const WalletNavBarContainer = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const { toggleNodeSettings, toggleP2PSettings, toggleTorSettings } = useStoreActions((actions) => actions.ui);

  return (
    <Navbar className="bp4-dark">
      <NavbarGroup align={Alignment.LEFT}>
        <Button
          minimal={true}
          icon="settings"
          onClick={() => {
            toggleNodeSettings(true);
          }}
        />
        <Button
          minimal={true}
          icon="ip-address"
          onClick={() => {
            toggleP2PSettings(true);
          }}
        />
        <Button
          minimal={true}
          icon="shield"
          onClick={() => {
            toggleTorSettings(true);
          }}
        />
        <NavbarDivider />
        <Button
          minimal={true}
          icon="console"
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
        <Button
          minimal={true}
          icon="lifesaver"
          onClick={() => history.push("/help")}
        />
      </NavbarGroup>
    </Navbar>
  );
};
