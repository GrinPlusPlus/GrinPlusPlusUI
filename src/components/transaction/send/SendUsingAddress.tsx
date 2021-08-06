import { Button, Intent } from "@blueprintjs/core";

import React from "react";
import { useTranslation } from "react-i18next";

type SendGrinsButtonsProps = {
  amount: number;
  fee: number;
  spendable: number;
  inputsSelected: boolean;
  onSendButtonClickedCb: () => void;
};

export const SendUsingAddressComponent = ({
  amount,
  fee,
  spendable,
  inputsSelected,
  onSendButtonClickedCb,
}: SendGrinsButtonsProps) => {
  const { t } = useTranslation();
  return (
    <Button
      intent={Intent.PRIMARY}
      style={{ color: "black", width: "120px" }}
      disabled={
        amount <= 0 ||
        spendable <= 0 ||
        !inputsSelected ||
        amount + fee > spendable
      }
      onClick={onSendButtonClickedCb}
    >
      {t("send")}
    </Button>
  );
};
