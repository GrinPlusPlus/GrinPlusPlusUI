import React from "react";
import { Title } from "../../styled";
import {
  Button,
  ControlGroup,
  FileInput,
  FormGroup,
  Intent
} from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

type FinalizeProps = {
  responseFile: File | undefined;
  setFileToFinalizeCb: (file: File) => void;
  onFinalizeButtonClickedCb: () => void;
};

export const FinalizeComponent = ({
  responseFile,
  setFileToFinalizeCb,
  onFinalizeButtonClickedCb
}: FinalizeProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Title>{t("finalize")}</Title>
      <FormGroup
        helperText={t("finalize_helper")}
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
            {t("process")}
          </Button>
          <FileInput
            buttonText={t("browse")}
            inputProps={{ accept: ".response" }}
            className="bp3-dark"
            fill={true}
            text={responseFile ? responseFile.name : t("choose_response_file")}
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
};
