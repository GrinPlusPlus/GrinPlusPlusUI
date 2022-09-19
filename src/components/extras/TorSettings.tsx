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

export const TorSettingsComponent = ({
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
        <TextArea growVertically={false} title="obfs4" style={{ width: "98%", minHeight: "50px", fontFamily: "Courier New"  }}>{allowedPeers}</TextArea>
      </FormGroup>
      <FormGroup label={t("obfs4")}>
        <TextArea growVertically={false} title="obfs4" style={{ width: "98%", minHeight: "100px", fontFamily: "Courier New"  }}>{allowedPeers}</TextArea>
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
