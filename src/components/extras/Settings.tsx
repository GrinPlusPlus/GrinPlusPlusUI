import React from 'react';
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
  Text
  } from '@blueprintjs/core';

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
  restartNodeCb: () => void;
  toggleConfirmationDialogCb: () => void;
  confirmReSyncBlockchainCb: () => void;
};

export default function SettingsComponent({
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
  restartNodeCb,
  toggleConfirmationDialogCb,
  confirmReSyncBlockchainCb
}: SettingsProps) {
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
          Use <strong>GrinJoin</strong>
        </Switch>
        <InputGroup
          data-testid="grinjoin-address-input"
          disabled={!useGrinJoin}
          placeholder="GrinJoin Address"
          value={grinJoinAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setGrinJoinAddressCb(e.target.value)
          }
        />
        <br />
        <Divider />
        <br />
        <FormGroup
          label={"Minimum number of peers"}
          labelFor="mininum-number-peers"
        >
          <NumericInput
            data-testid="mininum-number-peers-input"
            id="mininum-number-peers"
            value={mininumPeers}
            onValueChange={value => setMininumPeersCb(value)}
          />
        </FormGroup>
        <FormGroup
          label={"Maximum number of peers"}
          labelFor="maximum-number-peers"
        >
          <NumericInput
            data-testid="maximum-number-peers-input"
            id="maximum-number-peers"
            value={maximumPeers}
            onValueChange={value => setMaximumPeersCb(value)}
          />
        </FormGroup>
        <FormGroup label={"Confirmations"}>
          <Slider
            min={0}
            max={30}
            stepSize={1}
            labelStepSize={10}
            data-testid="confirmations-slider"
            value={confirmations}
            showTrackFill={false}
            onChange={value => setConfirmationsCb(value)}
          />
        </FormGroup>
        <Divider />
        <FormGroup
          label={"Node data location"}
          labelFor="note-data-path"
          disabled={true}
        >
          <InputGroup
            id="note-data-path"
            readOnly={true}
            placeholder={nodeDataPath}
          />
        </FormGroup>
        <FormGroup label={"Node"} labelFor="wallet-path" disabled={true}>
          <InputGroup
            id="wallet-path"
            placeholder={nodeBinaryPath}
            readOnly={true}
          />
        </FormGroup>
        <Text>Node Actions</Text>
        <ControlGroup>
          <Button
            text={isNodeRunning ? "Restart" : "Start"}
            onClick={() => restartNodeCb()}
            style={{ width: "50%" }}
            intent={Intent.NONE}
          />
          <Button
            text="Resync"
            disabled={status.toLowerCase() !== "running"}
            style={{ width: "50%" }}
            intent={Intent.WARNING}
            onClick={() => toggleConfirmationDialogCb()}
          />
        </ControlGroup>
      </div>
      <Callout>
        After changing these values you will need to <b>Restart the Node</b> in
        order to load the new settings.
      </Callout>
      <Alert
        className="bp3-dark"
        cancelButtonText="Cancel"
        confirmButtonText="Resync Node"
        icon="refresh"
        intent={Intent.WARNING}
        isOpen={isConfirmationDialogOpen}
        onCancel={() => toggleConfirmationDialogCb()}
        onConfirm={async () => {
          confirmReSyncBlockchainCb();
        }}
      >
        <p>
          Are you sure you want to <b>resync</b> the Node? This will donwload
          around 1GB again and will take time.
        </p>
      </Alert>
    </div>
  );
}
