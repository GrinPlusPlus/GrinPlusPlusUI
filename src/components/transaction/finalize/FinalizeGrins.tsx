import React from 'react';
import { Title } from '../../styled';
import {
  Button,
  ControlGroup,
  FileInput,
  FormGroup,
  Intent,
} from "@blueprintjs/core";

type FinalizeProps = {
  responseFile: File | undefined;
  setFileToFinalizeCb: (file: File) => void;
  onFinalizeButtonClickedCb: () => void;
};

export default function FinalizeComponent({
  responseFile,
  setFileToFinalizeCb,
  onFinalizeButtonClickedCb,
}: FinalizeProps) {
  return (
    <div>
      <Title>Finalize</Title>
      <FormGroup
        helperText="After receiving the Grins, the recipient will send a transaction response file back to you."
        style={{ marginTop: "10px" }}
      >
        <ControlGroup>
          <Button
            data-testid="send-using-tor-button"
            intent={Intent.PRIMARY}
            style={{ color: "black" }}
            disabled={!responseFile}
            onClick={onFinalizeButtonClickedCb}
          >
            Process
          </Button>
          <FileInput
            inputProps={{ accept: ".response" }}
            className="bp3-dark"
            fill={true}
            text={
              responseFile ? responseFile.name : "Choose the .response file..."
            }
            onInputChange={(event: React.SyntheticEvent) => {
              const target = event.target as HTMLInputElement;
              if (target?.files) {
                setFileToFinalizeCb(target.files[0]);
              }
            }}
          />
        </ControlGroup>
      </FormGroup>
    </div>
  );
}
