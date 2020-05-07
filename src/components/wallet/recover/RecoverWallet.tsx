import { InputPasswordComponent } from "../../custom/InputPassword";
import React from "react";
import { WalletSeedInputComponent } from "../../shared/WalletSeedInput";
import { ISeed } from "../../../interfaces/ISeed";
import { SubmitButton, HorizontallyCenter } from "../../styled";
import {
  Button,
  FormGroup,
  InputGroup,
  Intent,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

type RecoverWalletProps = {
  username: string;
  password: string;
  isSeedCompleted: boolean;
  seed: ISeed[];
  seedLength: string;
  status: string;
  setUsernameCb: (username: string) => void;
  setPasswordCb: (password: string) => void;
  setSeedLengthCb: (length: string) => void;
  onWordChangeCb: (word: string, position: number) => void;
  onButtonClickedCb: () => void;
};

export const RecoverWalletComponent = ({
  username,
  password,
  isSeedCompleted,
  seed,
  seedLength,
  status,
  setUsernameCb,
  setPasswordCb,
  setSeedLengthCb,
  onWordChangeCb,
  onButtonClickedCb,
}: RecoverWalletProps) => {
  const { t } = useTranslation();

  return (
    <div data-testid="restore-wallet">
      <FormGroup label={t("username")}>
        <InputGroup
          className="bp3-dark"
          style={{ backgroundColor: "#21242D" }}
          id="restore-wallet-username"
          required={true}
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsernameCb(e.target.value)
          }
        />
      </FormGroup>
      <FormGroup label={t("password")}>
        <InputPasswordComponent
          password={password}
          autoFocus={false}
          cb={(password: string) => setPasswordCb(password)}
        />
      </FormGroup>
      <div>
        <RadioGroup
          inline={true}
          className="bp3-dark"
          label={t("seed")}
          name="seedLength"
          selectedValue={seedLength}
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            let target = event.target as HTMLInputElement;
            setSeedLengthCb(target.value);
          }}
        >
          <Radio label="12" value="12" />
          <Radio label="15" value="15" />
          <Radio label="18" value="18" />
          <Radio label="21" value="21" />
          <Radio label="24" value="24" />
        </RadioGroup>
        <HorizontallyCenter>
          <WalletSeedInputComponent
            seed={seed}
            onWordChangeCb={onWordChangeCb}
            length={+seedLength}
          />
        </HorizontallyCenter>
      </div>
      <br />
      <SubmitButton>
        <Button
          data-testid="restore-wallet-button"
          text={t("restore_wallet")}
          intent={Intent.PRIMARY}
          style={{ color: "black", width: "200px" }}
          onClick={onButtonClickedCb}
          disabled={
            !(username !== "" && password !== "" && isSeedCompleted) ||
            status.toLowerCase() !== "running"
          }
        />
      </SubmitButton>
    </div>
  );
};
