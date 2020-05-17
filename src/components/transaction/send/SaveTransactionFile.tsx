import { Button, Intent } from "@blueprintjs/core";

import React from "react";
import { useTranslation } from "react-i18next";

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
  onSaveButtonClickedCb
}: SendGrinsButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Button
      intent={Intent.PRIMARY}
      style={{
        color: "black",
        width: "120px"
      }}
      icon="document"
      disabled={amount <= 0 || spendable < amount + fee || !inputsSelected}
      onClick={onSaveButtonClickedCb}
    >
      {t("save_tx")}
    </Button>
  );
};
