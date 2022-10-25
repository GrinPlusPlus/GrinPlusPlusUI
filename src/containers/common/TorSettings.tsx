import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import {
  Dialog,
  TextArea,
  Button,
  Intent
} from "@blueprintjs/core";

import { useTranslation } from "react-i18next";

import { TorSettingsComponent } from "../../components/extras/TorSettings";
import { HorizontallyCenter } from "../../components/styled";

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
    setObfs4BridgesFromDialog,
    disableObfs4BridgesDialog
  } = useStoreActions((actions) => actions.settings);

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
        addTorObfs4BridgesButtonCb={() => {
          toggleObfs4BridgesDialog();
        }}
        disableTorObfs4BridgesButtonCb={() => {
          disableObfs4BridgesDialog();
        }}
      />
      <Dialog
        className="bp4-dark"
        icon="random"
        isOpen={isObfs4BridgesDialogOpen}
        onOpening={() => {
          const remote = require('electron').remote;
          const BrowserWindow = remote.BrowserWindow;
          const win = new BrowserWindow({
            height: 800,
            width: 800
          });
          win.loadURL("https://bridges.torproject.org/bridges?transport=obfs4");
        }}
      >
        <TextArea
          growVertically={false}
          title="obfs4"
          value={obfs4BridgesFromDialog}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setObfs4BridgesFromDialog(event.target.value);
          }}
          style={{ fontFamily: "Courier New", minHeight: "270px" }}>{""}</TextArea>
        <HorizontallyCenter>
          <Button
            minimal={true}
            large={true}
            text={t("cancel")}
            onClick={() => {
              toggleObfs4BridgesDialog();
              setObfs4BridgesFromDialog("");
            }}
          />
          <Button
            minimal={true}
            disabled={obfs4BridgesFromDialog.length === 0}
            intent={Intent.PRIMARY}
            text={t("save")}
            onClick={() => {
              enableObfs4TorBridges(obfs4BridgesFromDialog);
              toggleObfs4BridgesDialog();
              setObfs4BridgesFromDialog("");
            }}
          />
        </HorizontallyCenter>
      </Dialog>
    </div>
  );
};
