import {
  Alert,
  Button,
  Callout,
  Classes,
  ControlGroup,
  Divider,
  FormGroup,
  InputGroup,
  Intent,
  NumericInput,
  Slider,
} from "@blueprintjs/core";

import React from "react";
import { useTranslation } from "react-i18next";

type SettingsProps = {
  grinChckAddress: string;
  mininumPeers: number;
  maximumPeers: number;
  confirmations: number;
  isConfirmationDialogOpen: boolean;
  isLoggedIn: boolean;
  setGrinChckAddressCb: (address: string) => void;
  setMininumPeersCb: (peers: number) => void;
  setMaximumPeersCb: (peers: number) => void;
  setConfirmationsCb: (confirmations: number) => void;
  toggleConfirmationDialogCb: () => void;
  confirmReSyncBlockchainCb: () => void;
  restartNodeCb: () => void;
  scanForOutputsCb: () => void;
  backupButtonCb: () => void;
};

export const SettingsComponent = ({
  grinChckAddress,
  mininumPeers,
  maximumPeers,
  confirmations,
  isConfirmationDialogOpen,
  isLoggedIn,
  setGrinChckAddressCb,
  setMininumPeersCb,
  setMaximumPeersCb,
  setConfirmationsCb,
  toggleConfirmationDialogCb,
  confirmReSyncBlockchainCb,
  restartNodeCb,
  scanForOutputsCb,
  backupButtonCb,
}: SettingsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className={Classes.DIALOG_BODY}>
        <FormGroup label="GrinChck API URL:" inline={false}>
          <InputGroup
            data-testid="grinchck-address-input"
            placeholder="GrinChck"
            value={grinChckAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGrinChckAddressCb(e.target.value)
            }
          />
        </FormGroup>
        <Divider />
        <br />
        <FormGroup
          label={t("minimum_number_of_peers")}
          labelFor="mininum-number-peers"
        >
          <NumericInput
            data-testid="mininum-number-peers-input"
            id="mininum-number-peers"
            min={8}
            value={mininumPeers}
            onValueChange={(value) => setMininumPeersCb(value)}
          />
        </FormGroup>
        <FormGroup
          label={t("maximum_number_of_peers")}
          labelFor="maximum-number-peers"
        >
          <NumericInput
            data-testid="maximum-number-peers-input"
            id="maximum-number-peers"
            value={maximumPeers}
            onValueChange={(value) => setMaximumPeersCb(value)}
          />
        </FormGroup>
        <Divider />
        <br />
        <FormGroup label={t("confirmations")}>
          <Slider
            min={0}
            max={60}
            stepSize={2}
            labelStepSize={10}
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
              text={t("restart")}
              onClick={() => restartNodeCb()}
              style={{ width: "50%" }}
              intent={Intent.SUCCESS}
            />
            <Button
              text={t("resync")}
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
                  text={t("scan_for_outputs")}
                  style={{ width: "50%" }}
                  intent={Intent.NONE}
                  onClick={() => scanForOutputsCb()}
                />
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
      <Callout>{t("restart_warning")}.</Callout>
      <Alert
        className="bp3-dark"
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
