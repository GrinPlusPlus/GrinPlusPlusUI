import { InputPasswordComponent } from "../../../components/custom/InputPassword";
import React from "react";
import { SubmitButton } from "../../styled";
import {
  Button,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core";

type CreateWalletProps = {
  username: string;
  password: string;
  confirmation: string;
  status: string;
  minPasswordLength: number;
  receivedSeed: {
    position: number;
    text: string;
    disabled: boolean;
  }[];
  setUsernameCb: (username: string) => void;
  setPasswordCb: (password: string) => void;
  setConfirmationCb: (password: string) => void;
  signUpButtonCb: () => void;
  SeedValidationComponent: React.ReactNode;
};

export const CreateWalletComponent = ({
  username,
  password,
  confirmation,
  status,
  minPasswordLength,
  receivedSeed,
  setUsernameCb,
  setPasswordCb,
  setConfirmationCb,
  signUpButtonCb,
  SeedValidationComponent,
}: CreateWalletProps) => {
  return (
    <div data-testid="create-wallet">
      <FormGroup
        label={"Username"}
        helperText="This username will be used to login into the wallet."
        labelFor="create-wallet-name"
        labelInfo={true}
      >
        <InputGroup
          placeholder="Username"
          type="text"
          className="bp3-dark"
          style={{ backgroundColor: "#21242D" }}
          autoFocus={true}
          required={true}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUsernameCb(e.target.value);
          }}
          value={username}
        />
      </FormGroup>
      <FormGroup
        label={"Password"}
        helperText={`Password should be at least ${minPasswordLength} characters long.`}
        labelFor="create-wallet-password"
        labelInfo={true}
      >
        <InputPasswordComponent
          password={password}
          cb={setPasswordCb}
          autoFocus={false}
        />
      </FormGroup>
      <FormGroup
        label={"Confirm password"}
        helperText="Make sure the passwords match."
        labelFor="create-wallet-password-confirm"
        labelInfo={true}
      >
        <InputPasswordComponent
          password={confirmation}
          cb={setConfirmationCb}
          autoFocus={false}
        />
      </FormGroup>
      <SubmitButton>
        <Button
          data-testid="create-wallet-button"
          intent={Intent.PRIMARY}
          text="Create Wallet"
          style={{ color: "black", width: "200px" }}
          onClick={signUpButtonCb}
          disabled={
            !(
              username !== "" &&
              password.length >= minPasswordLength &&
              password === confirmation
            ) || status.toLowerCase() === "not connected"
          }
        />
      </SubmitButton>
      <Dialog
        isOpen={receivedSeed.length > 0}
        title="Wallet Seed"
        isCloseButtonShown={false}
        className="bp3-dark"
      >
        {SeedValidationComponent}
      </Dialog>
    </div>
  );
};
