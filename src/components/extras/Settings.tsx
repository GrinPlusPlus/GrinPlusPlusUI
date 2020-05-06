import React from "react";
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
  Switch,
  Text,
} from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

type SettingsProps = {
  status: string;
  floonet: boolean;
  useGrinJoin: boolean;
  grinJoinAddress: string;
  mininumPeers: number;
  maximumPeers: number;
  confirmations: number;
  nodeDataPath: string;
  nodeBinaryPath: string;
  isNodeRunning: boolean;
  isConfirmationDialogOpen: boolean;
  setGrinJoinUseCb: (active: boolean) => void;
  setGrinJoinAddressCb: (address: string) => void;
  setMininumPeersCb: (peers: number) => void;
  setMaximumPeersCb: (peers: number) => void;
  setConfirmationsCb: (confirmations: number) => void;
  toggleConfirmationDialogCb: () => void;
  confirmReSyncBlockchainCb: () => void;
  restartNodeCb: () => void;
};

export const SettingsComponent = ({
  status,
  floonet,
  useGrinJoin,
  grinJoinAddress,
  mininumPeers,
  maximumPeers,
  confirmations,
  nodeDataPath,
  nodeBinaryPath,
  isNodeRunning,
  isConfirmationDialogOpen,
  setGrinJoinUseCb,
  setGrinJoinAddressCb,
  setMininumPeersCb,
  setMaximumPeersCb,
  setConfirmationsCb,
  toggleConfirmationDialogCb,
  confirmReSyncBlockchainCb,
  restartNodeCb,
}: SettingsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className={Classes.DIALOG_BODY}>
        <Switch
          disabled={floonet}
          checked={useGrinJoin}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGrinJoinUseCb(e.target.checked);
          }}
        >
          <b>{t("grinjoin.1")}</b>
        </Switch>
        <InputGroup
          data-testid="grinjoin-address-input"
          disabled={!useGrinJoin}
          placeholder={t("grinjoin_address.1")}
          value={grinJoinAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setGrinJoinAddressCb(e.target.value)
          }
        />
        <br />
        <Divider />
        <br />
        <FormGroup
          label={t("minimum_number_of_peers.1")}
          labelFor="mininum-number-peers"
        >
          <NumericInput
            data-testid="mininum-number-peers-input"
            id="mininum-number-peers"
            value={mininumPeers}
            onValueChange={(value) => setMininumPeersCb(value)}
          />
        </FormGroup>
        <FormGroup
          label={t("maximum_number_of_peers.1")}
          labelFor="maximum-number-peers"
        >
          <NumericInput
            data-testid="maximum-number-peers-input"
            id="maximum-number-peers"
            value={maximumPeers}
            onValueChange={(value) => setMaximumPeersCb(value)}
          />
        </FormGroup>
        <FormGroup label={t("confirmations.1")}>
          <Slider
            min={0}
            max={30}
            stepSize={1}
            labelStepSize={10}
            data-testid="confirmations-slider"
            value={confirmations}
            showTrackFill={false}
            onChange={(value) => setConfirmationsCb(value)}
          />
        </FormGroup>
        <Divider />
        <FormGroup
          label={t("node_data_location.1")}
          labelFor="note-data-path"
          disabled={true}
        >
          <InputGroup
            id="note-data-path"
            readOnly={true}
            placeholder={nodeDataPath}
          />
        </FormGroup>
        <FormGroup label={t("node.1")} labelFor="wallet-path" disabled={true}>
          <InputGroup
            id="wallet-path"
            placeholder={nodeBinaryPath}
            readOnly={true}
          />
        </FormGroup>
        <Text>{t("node_actions.1")}</Text>
        <ControlGroup>
          <Button
            text={t("restart.1")}
            onClick={() => restartNodeCb()}
            style={{ width: "50%" }}
            intent={Intent.DANGER}
          />
          <Button
            text={t("resync.1")}
            disabled={status.toLowerCase() !== "running"}
            style={{ width: "50%" }}
            intent={Intent.WARNING}
            onClick={() => toggleConfirmationDialogCb()}
          />
        </ControlGroup>
      </div>
      <Callout>
        {t("restart_warning.1")}.
      </Callout>
      <Alert
        className="bp3-dark"
        cancelButtonText={t("cancel.1")}
        confirmButtonText={t("resync_node.1")}
        icon="refresh"
        intent={Intent.WARNING}
        isOpen={isConfirmationDialogOpen}
        onCancel={() => toggleConfirmationDialogCb()}
        onConfirm={async () => {
          confirmReSyncBlockchainCb();
        }}
      >
        <p>{t("resync_confirmation.1")}.</p>
      </Alert>
    </div>
  );
};
