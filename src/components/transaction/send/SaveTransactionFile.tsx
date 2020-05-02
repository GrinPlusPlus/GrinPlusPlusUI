import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

type SendGrinsButtonsProps = {
  amount: number;
  fee: number;
  spendable: number;
  inputsSelected: boolean;
  onSaveButtonClickedCb: () => void;
};

export const SaveTransactionFileComponent = ({
  amount,
  fee,
  spendable,
  inputsSelected,
  onSaveButtonClickedCb,
}: SendGrinsButtonsProps) => {
  return (
    <Button
      intent={Intent.PRIMARY}
      style={{
        color: "black",
        width: "120px",
      }}
      icon="document"
      disabled={amount <= 0 || spendable < amount + fee || !inputsSelected}
      onClick={onSaveButtonClickedCb}
    >
      Save Tx
    </Button>
  );
};
