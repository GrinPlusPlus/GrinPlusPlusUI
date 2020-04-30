import { SettingsContainer } from "./Settings";
import { Drawer } from "@blueprintjs/core";
import { useStoreState, useStoreActions } from "../../hooks";
import React from "react";
import { useHistory } from "react-router-dom";

export const WalletDrawer = () => {
  let history = useHistory();
  const { showSettings } = useStoreState((state) => state.ui);
  const { toggleSettings } = useStoreActions((actions) => actions.ui);
  const { checkNodeHealth } = useStoreActions((actions) => actions.wallet);

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
      onOpened={async () =>
        await checkNodeHealth().catch(() => history.push("/error"))
      }
      isOpen={showSettings}
      size={Drawer.SIZE_SMALL}
    >
      <SettingsContainer />
    </Drawer>
  );
};
