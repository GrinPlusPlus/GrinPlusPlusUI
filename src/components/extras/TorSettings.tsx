import React, { ChangeEvent } from "react";

import {
  Button,
  Classes,
  Divider,
  FormGroup,
  Intent,
  Switch,
  TextArea,
  Text,
} from "@blueprintjs/core";

import { useTranslation } from "react-i18next";

type TorSettingsProps = {
  shouldReuseAddress: boolean;
  isLoggedIn: boolean;
  areTorBridgesEnabled: boolean;
  snowflakeBridges: string;
  obfs4Bridges: string;
  onChangeShouldReuseAddressSwitchCb: (reuse: boolean) => void;
  onChangeTorBrigesSwitchCb: (reuse: boolean) => void;
  addTorBridgesButtonCb: () => void;
};

export const TorSettingsComponent = ({
  shouldReuseAddress,
  isLoggedIn,
  areTorBridgesEnabled,
  snowflakeBridges,
  obfs4Bridges,
  onChangeShouldReuseAddressSwitchCb,
  onChangeTorBrigesSwitchCb,
  addTorBridgesButtonCb,
}: TorSettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className={Classes.DIALOG_BODY}>
      {isLoggedIn ? (
        <FormGroup>
          <Switch label={t("reuse_address")}
            checked={shouldReuseAddress}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onChangeShouldReuseAddressSwitchCb(event.target.checked)} />
          <Divider />
          <Text className={Classes.TEXT_MUTED}>{t("reuse_address_help")}</Text>
        </FormGroup>
      ) : null}
      <FormGroup label={t("bridges")}>
        <Text className={Classes.TEXT_MUTED}>{t("tor_bridges_help")}</Text>
        <Divider />
        <Switch label={t("snowflake")}
          checked={areTorBridgesEnabled}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChangeTorBrigesSwitchCb(event.target.checked)} />
      </FormGroup>
      <FormGroup>
        <TextArea readOnly={true}
          growVertically={false}
          title="obfs4"
          value={snowflakeBridges}
          style={{ width: "98%", minHeight: "80px", fontFamily: "Courier New" }}>{""}</TextArea>
      </FormGroup>
      <FormGroup label={t("obfs4")}>
        <TextArea readOnly={true}
          growVertically={false}
          title="obfs4"
          value={obfs4Bridges}
          style={{ width: "98%", minHeight: "160px", fontFamily: "Courier New" }}>{""}</TextArea>
      </FormGroup>
      <Button
        text={t("add_obfs4_bridges")}
        style={{ float: "right" }}
        intent={Intent.NONE}
        onClick={() => addTorBridgesButtonCb()}
      />
    </div>
  );
};
