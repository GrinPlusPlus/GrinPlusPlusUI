import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

type SendGrinsButtonsProps = {
  amount: number;
  spendable: number;
  inputsSelected: boolean;
  isAddressValid: boolean;
  onSendButtonClickedCb: () => void;
};

export default function SendUsingAddressComponent({
  amount,
  spendable,
  inputsSelected,
  isAddressValid,
  onSendButtonClickedCb,
}: SendGrinsButtonsProps) {
  return (
    <Button
      intent={Intent.PRIMARY}
      style={{ color: "black", width: "120px" }}
      icon="globe"
      disabled={
        amount <= 0 || spendable <= 0 || !isAddressValid || !inputsSelected
      }
      onClick={onSendButtonClickedCb}
    >
      Send
    </Button>
  );
}
