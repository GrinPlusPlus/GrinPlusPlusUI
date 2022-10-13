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
  preferredPeers: string[];
  allowedPeers: string[];
  blockedPeers: string[];
  saveButtonCb: () => void;
  setPreferredPeersCb: (peers: string) => void;
  setAllowedPeersCb: (peers: string) => void;
  setBlockedPeersCb: (peers: string) => void;
};

export const P2PSettingsComponent = ({
  preferredPeers,
  allowedPeers,
  blockedPeers,
  saveButtonCb,
  setPreferredPeersCb,
  setAllowedPeersCb,
  setBlockedPeersCb
}: P2PSettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className={Classes.DIALOG_BODY} >
      <FormGroup label={t("preferred_peers")}>
        <TextArea onChange={(event) => setPreferredPeersCb(event.target.value)}
          style={{ width: "98%", minHeight: "250px", fontFamily: "Courier New" }}
          value={preferredPeers.join("\n")} />
      </FormGroup>
      <FormGroup label={t("allowed_peers")}>
        <TextArea onChange={(event) => setAllowedPeersCb(event.target.value)}
          style={{ width: "98%", minHeight: "100px", fontFamily: "Courier New" }}
          value={allowedPeers.join("\n")} />
      </FormGroup>
      <FormGroup label={t("blocked_peers")}>
        <TextArea onChange={(event) => setBlockedPeersCb(event.target.value)}
          style={{ width: "98%", minHeight: "100px", fontFamily: "Courier New" }}
          value={blockedPeers.join("\n")} />
      </FormGroup>
      <Button
        text={t("save")}
        style={{ float: "right" }}
        intent={Intent.NONE}
        onClick={() => saveButtonCb()}
      />
    </div>
  );
};
