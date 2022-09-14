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
  mininumPeers: number;
  maximumPeers: number;
  confirmations: number;
  shouldReuseAddress: boolean;
  preferredPeers: string;
  allowedPeers: string;
  blockedPeers: string;
  isConfirmationDialogOpen: boolean;
  isLoggedIn: boolean;
  setMininumPeersCb: (peers: number) => void;
  setMaximumPeersCb: (peers: number) => void;
  setConfirmationsCb: (confirmations: number) => void;
  toggleConfirmationDialogCb: () => void;
  confirmReSyncBlockchainCb: () => void;
  restartNodeCb: () => void;
  scanForOutputsCb: () => void;
  backupButtonCb: () => void;
};

export const P2PSettingsComponent = ({
  mininumPeers,
  maximumPeers,
  confirmations,
  shouldReuseAddress,
  preferredPeers,
  allowedPeers,
  blockedPeers,
  isConfirmationDialogOpen,
  isLoggedIn,
  setMininumPeersCb,
  setMaximumPeersCb,
  setConfirmationsCb,
  toggleConfirmationDialogCb,
  confirmReSyncBlockchainCb,
  backupButtonCb,
}: P2PSettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className={Classes.DIALOG_BODY} >
      <FormGroup label={t("preferred_peers")}>
        <TextArea style={{ width: "98%", minHeight: "250px" }}>{preferredPeers}</TextArea>
      </FormGroup>
      <FormGroup label={t("allowed_peers")}>
        <TextArea style={{ width: "98%", minHeight: "100px" }}>{allowedPeers}</TextArea>
      </FormGroup>
      <FormGroup label={t("blocked_peers")}>
        <TextArea style={{ width: "98%", minHeight: "100px" }}>{blockedPeers}</TextArea>
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
