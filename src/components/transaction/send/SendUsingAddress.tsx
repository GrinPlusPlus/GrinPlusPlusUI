import React from "react";
import { Button, Intent } from "@blueprintjs/core";

type SendGrinsButtonsProps = {
  amount: number;
  fee: number;
  spendable: number;
  inputsSelected: boolean;
  isAddressValid: boolean;
  onSendButtonClickedCb: () => void;
};

export const SendUsingAddressComponent = ({
  amount,
  fee,
  spendable,
  inputsSelected,
  isAddressValid,
  onSendButtonClickedCb,
}: SendGrinsButtonsProps) => {
  return (
    <Button
      intent={Intent.PRIMARY}
      style={{ color: "black", width: "120px" }}
      icon="globe"
      disabled={
        amount <= 0 ||
        spendable < amount + fee ||
        !isAddressValid ||
        !inputsSelected
      }
      onClick={onSendButtonClickedCb}
    >
      Send
    </Button>
  );
};
