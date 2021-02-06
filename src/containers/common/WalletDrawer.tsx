import { useStoreActions, useStoreState } from "../../hooks";

import { Drawer } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { SettingsContainer } from "./Settings";
import { useTranslation } from "react-i18next";

export const WalletDrawer = () => {
  const { t } = useTranslation();

  const { isLoggedIn } = useStoreState((state) => state.session);
  const { showSettings } = useStoreState((state) => state.ui);
  const { toggleSettings } = useStoreActions((actions) => actions.ui);

  const { getNodeSettings } = useStoreActions((actions) => actions.settings);

  useEffect(() => {
    (async function () {
      const log = require("electron-log");
      log.info("Getting node settings...");

      try {
        await getNodeSettings();
      } catch (error) {
        log.error(
          `Error trying to get Node Settings from the Backend: ${error.message}`
        );
      }
    })();
  }, [getNodeSettings]);

  return (
    <Drawer
      className="bp3-dark"
      transitionDuration={0}
      position={isLoggedIn ? "right" : "left"}
      icon="cog"
      onClose={() => {
        toggleSettings(false);
      }}
      title={t("settings")}
      isOpen={showSettings}
      size={Drawer.SIZE_SMALL}
      style={{ paddingTop: "32px" }}
    >
      <SettingsContainer />
    </Drawer>
  );
};
