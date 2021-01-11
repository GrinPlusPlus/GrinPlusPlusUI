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

  let history = useHistory();

  const { toggleSettings } = useStoreActions((actions) => actions.ui);

  return (
    <Navbar className="bp3-dark">
      <NavbarGroup align={Alignment.LEFT}>
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
