import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

type SendGrinsButtonsProps = {
  amount: number;
  spendable: number;
  inputsSelected: boolean;
  onSaveButtonClickedCb: () => void;
};

export default function SaveTransactionFileComponent({
  amount,
  spendable,
  inputsSelected,
  onSaveButtonClickedCb,
}: SendGrinsButtonsProps) {
  return (
    <Button
      intent={Intent.PRIMARY}
      style={{
        color: "black",
        width: "120px",
      }}
      icon="document"
      disabled={amount <= 0 || spendable === 0 || !inputsSelected}
      onClick={onSaveButtonClickedCb}
    >
      Save Tx
    </Button>
  );
}
