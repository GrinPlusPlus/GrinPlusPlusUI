import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import {
  Alert,
  TextArea,
  Intent
} from "@blueprintjs/core";

import { useTranslation } from "react-i18next";

import { TorSettingsComponent } from "../../components/extras/TorSettings";

export const TorSettingsContainer = () => {
  const { t } = useTranslation();

  const { isLoggedIn } = useStoreState(
    (state) => state.session
  );

  const {
    shouldReuseAddress,
    isTorBridgesFeaturesEnabled,
    snowflakeBridges,
    obfs4Bridges,
    isObfs4BridgesDialogOpen,
    obfs4BridgesFromDialog,
  } = useStoreState((state) => state.settings);

  const { getTorSettings,
    getNodeSettings,
    enableAddressReuse,
    enableSnowflakeTorBridges,
    toggleObfs4BridgesDialog,
    enableObfs4TorBridges,
    setObfs4BridgesFromDialog
  } = useStoreActions((actions) => actions.settings);

  const { toggleTorSettings } = useStoreActions((actions) => actions.ui);

  useEffect(() => {
    (async function () {
      const log = require("electron-log");
      try {
        await getTorSettings();
        await getNodeSettings();
      } catch (error) {
        log.error(
          `Error trying to get Node Settings from the Backend: ${error.message}`
        );
      }
    })();
  }, [getTorSettings, getNodeSettings]);

  return (
    <div>
      <TorSettingsComponent
        shouldReuseAddress={shouldReuseAddress}
        isLoggedIn={isLoggedIn}
        areTorBridgesEnabled={isTorBridgesFeaturesEnabled}
        snowflakeBridges={snowflakeBridges.join("\n")}
        obfs4Bridges={obfs4Bridges.join("\n")}
        onChangeShouldReuseAddressSwitchCb={enableAddressReuse}
        onChangeTorBrigesSwitchCb={enableSnowflakeTorBridges}
        addTorBridgesButtonCb={() => {
          toggleObfs4BridgesDialog();
        }}
      />
      <Alert
        className="bp4-dark"
        cancelButtonText={t("cancel")}
        confirmButtonText={t("save")}
        icon="random"
        intent={Intent.WARNING}
        isOpen={isObfs4BridgesDialogOpen}
        onCancel={() => toggleObfs4BridgesDialog()}
        onConfirm={async () => {
          toggleObfs4BridgesDialog();
          await enableObfs4TorBridges(obfs4BridgesFromDialog);
        }}
      >
        <TextArea
          growVertically={false}
          title="obfs4"
          value={obfs4BridgesFromDialog}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setObfs4BridgesFromDialog(event.target.value);
          }}
          style={{ fontFamily: "Courier New" }}>{""}</TextArea>
      </Alert>
    </div>
  );
};
