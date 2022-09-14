import React from "react";
import { Drawer } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";
import { NodeSettingsContainer } from "./NodeSettings";
import { useTranslation } from "react-i18next";

export const NodeSettingsDrawer = () => {
  const { t } = useTranslation();

  const { isLoggedIn } = useStoreState((state) => state.session);
  const { showNodeSettings } = useStoreState((state) => state.ui);
  const { toggleNodeSettings } = useStoreActions((actions) => actions.ui);

  return (
    <Drawer
      className="bp4-dark"
      transitionDuration={0}
      position={isLoggedIn ? "right" : "left"}
      icon="settings"
      onClose={() => {
        toggleNodeSettings(false);
      }}
      title={t("node_settings")}
      isOpen={showNodeSettings}
      size={Drawer.SIZE_SMALL}
      style={{ paddingTop: "32px" }}
    >
      <NodeSettingsContainer />
    </Drawer>
  );
};
