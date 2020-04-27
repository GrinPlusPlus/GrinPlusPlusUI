import { SettingsContainer } from "./Settings";
import { Drawer } from "@blueprintjs/core";
import { useStoreState, useStoreActions } from "../../hooks";
import React from "react";

export const WalletDrawer = () => {
  const { showSettings } = useStoreState((state) => state.ui);
  const { toggleSettings } = useStoreActions((actions) => actions.ui);
  return (
    <Drawer
      className="bp3-dark"
      transitionDuration={0}
      position="left"
      icon="cog"
      onClose={() => {
        toggleSettings();
      }}
      title="Settings"
      isOpen={showSettings}
      size={Drawer.SIZE_SMALL}
    >
      <SettingsContainer />
    </Drawer>
  );
};
