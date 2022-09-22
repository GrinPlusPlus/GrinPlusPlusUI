import React from "react";

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
  backupButtonCb: () => void;
};

export const TorSettingsComponent = ({
  shouldReuseAddress,
  isLoggedIn,
  backupButtonCb,
}: TorSettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FormGroup label={t("bridges")}>
        <Switch label={t("enabled")} />
        <Divider />
        <Text className={Classes.TEXT_MUTED}>{t("tor_bridges_help")}</Text>
      </FormGroup>
      <FormGroup label={t("snowflake")}>
        <TextArea growVertically={false} title="obfs4" style={{ width: "98%", minHeight: "50px", fontFamily: "Courier New" }}>{""}</TextArea>
      </FormGroup>
      <FormGroup label={t("obfs4")}>
        <TextArea growVertically={false} title="obfs4" style={{ width: "98%", minHeight: "100px", fontFamily: "Courier New" }}>{""}</TextArea>
      </FormGroup>
      <Button
        text={t("save")}
        style={{ float: "right" }}
        intent={Intent.NONE}
        onClick={() => backupButtonCb()}
      />
    </div>
  );
};
