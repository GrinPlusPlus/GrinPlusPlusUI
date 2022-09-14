import React from "react";

import {
  Alert,
  Button,
  Classes,
  ControlGroup,
  Divider,
  FormGroup,
  Intent,
  NumericInput,
  Slider,
} from "@blueprintjs/core";

import { useTranslation } from "react-i18next";

type NodeSettingsProps = {
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

export const NodeSettingsComponent = ({
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
}: NodeSettingsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className={Classes.DIALOG_BODY}>
        <FormGroup
          label={t("outbound_peers")}
          labelFor="mininum-number-peers"
        >
          <NumericInput
            data-testid="mininum-number-peers-input"
            id="mininum-number-peers"
            min={3}
            max={8}
            allowNumericCharactersOnly={true}
            value={mininumPeers}
            onValueChange={(value) => setMininumPeersCb(value)}
          />
        </FormGroup>
        <FormGroup
          label={t("inbound_peers")}
          labelFor="maximum-number-peers"
        >
          <NumericInput
            data-testid="maximum-number-peers-input"
            id="maximum-number-peers"
            allowNumericCharactersOnly={true}
            min={0}
            value={maximumPeers - mininumPeers}
            onValueChange={(value) => setMaximumPeersCb(value)}
          />
        </FormGroup>
        <Divider />
        <br />
        <FormGroup label={t("confirmations")}>
          <Slider
            min={3}
            max={30}
            stepSize={3}
            labelStepSize={3}
            data-testid="confirmations-slider"
            value={confirmations}
            showTrackFill={false}
            onChange={(value) => setConfirmationsCb(value)}
          />
        </FormGroup>
        <Divider />
        <br />
        <FormGroup label={t("node_actions")}>
          <ControlGroup>
            <Button
              text={t("resync_node")}
              style={{ width: "50%" }}
              intent={Intent.WARNING}
              onClick={() => toggleConfirmationDialogCb()}
            />
          </ControlGroup>
        </FormGroup>
        {isLoggedIn ? (
          <div>
            <FormGroup label={t("wallet_actions")}>
              <ControlGroup>
                <Button
                  text={t("export_seed")}
                  style={{ width: "50%" }}
                  intent={Intent.NONE}
                  onClick={() => backupButtonCb()}
                />
              </ControlGroup>
            </FormGroup>
          </div>
        ) : null}
      </div>
      <br />
      <Alert
        className="bp4-dark"
        cancelButtonText={t("cancel")}
        confirmButtonText={t("resync_node")}
        icon="refresh"
        intent={Intent.WARNING}
        isOpen={isConfirmationDialogOpen}
        onCancel={() => toggleConfirmationDialogCb()}
        onConfirm={async () => {
          confirmReSyncBlockchainCb();
        }}
      >
        <p>{t("resync_confirmation")}.</p>
      </Alert>
    </div>
  );
};
