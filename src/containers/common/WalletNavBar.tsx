import {
  Alignment,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
} from "@blueprintjs/core";

import { LanguageMenuContainer } from "./LanguageMenu";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStoreActions } from "../../hooks";
import { useTranslation } from "react-i18next";

export const WalletNavBarContainer = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { toggleSettings } = useStoreActions((actions) => actions.ui);

  return (
    <Navbar className="bp4-dark">
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
          onClick={() =>  navigate("/status")}
        />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          minimal={true}
          icon="build"
          text={t("create")}
          onClick={() =>  navigate("/create")}
        />
        <NavbarDivider />
        <Button
          minimal={true}
          icon="layers"
          text={t("restore")}
          onClick={() =>  navigate("/restore")}
        />
        <NavbarDivider />
        <LanguageMenuContainer />
        <Button
          minimal={true}
          icon="lifesaver"
          onClick={() =>  navigate("/help")}
        />
      </NavbarGroup>
    </Navbar>
  );
};
