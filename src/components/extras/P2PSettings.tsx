import React from "react";

import {
  Button,
  Classes,
  FormGroup,
  Intent,
  TextArea,
} from "@blueprintjs/core";

import { useTranslation } from "react-i18next";

type P2PSettingsProps = {
  preferredPeers: string;
  allowedPeers: string;
  blockedPeers: string;
  backupButtonCb: () => void;
};

export const P2PSettingsComponent = ({
  preferredPeers,
  allowedPeers,
  blockedPeers,
  backupButtonCb,
}: P2PSettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className={Classes.DIALOG_BODY} >
      <FormGroup label={t("preferred_peers")}>
        <TextArea style={{ width: "98%", minHeight: "250px", fontFamily: "Courier New" }} value={preferredPeers} />
      </FormGroup>
      <FormGroup label={t("allowed_peers")}>
        <TextArea style={{ width: "98%", minHeight: "100px", fontFamily: "Courier New" }} value={allowedPeers} />
      </FormGroup>
      <FormGroup label={t("blocked_peers")}>
        <TextArea style={{ width: "98%", minHeight: "100px", fontFamily: "Courier New" }} value={blockedPeers} />
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
