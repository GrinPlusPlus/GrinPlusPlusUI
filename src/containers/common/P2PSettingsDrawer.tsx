import React from "react";
import { Drawer } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";
import { P2PSettingsContainer } from "./P2PSettings";
import { useTranslation } from "react-i18next";

export const P2PSettingsDrawer = () => {
  const { t } = useTranslation();

  const { isLoggedIn } = useStoreState((state) => state.session);
  const { showP2PSettings } = useStoreState((state) => state.ui);
  const { toggleP2PSettings } = useStoreActions((actions) => actions.ui);

  return (
    <Drawer
      className="bp4-dark"
      transitionDuration={0}
      position={isLoggedIn ? "right" : "left"}
      icon="ip-address"
      onClose={() => {
        toggleP2PSettings(false);
      }}
      title={t("p2p_settings")}
      isOpen={showP2PSettings}
      size={Drawer.SIZE_SMALL}
      style={{ paddingTop: "32px" }}
    >
      <P2PSettingsContainer />
    </Drawer>
  );
};
