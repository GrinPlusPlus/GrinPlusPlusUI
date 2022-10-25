import React from "react";
import { Drawer } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";
import { TorSettingsContainer } from "./TorSettings";
import { useTranslation } from "react-i18next";

export const TorSettingsDrawer = () => {
  const { t } = useTranslation();

  const { isLoggedIn } = useStoreState((state) => state.session);
  const { showTorSettings } = useStoreState((state) => state.ui);
  const { toggleTorSettings } = useStoreActions((actions) => actions.ui);

  return (
    <Drawer
      className="bp4-dark"
      transitionDuration={0}
      position={isLoggedIn ? "right" : "left"}
      icon="shield"
      onClose={() => {
        toggleTorSettings(false);
      }}
      title={t("tor_settings")}
      isOpen={showTorSettings}
      size={Drawer.SIZE_SMALL}
      style={{ paddingTop: "32px" }}
    >
      <TorSettingsContainer />
    </Drawer>
  );
};
