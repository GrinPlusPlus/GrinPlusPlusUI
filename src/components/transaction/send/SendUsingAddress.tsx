import { Button, Intent } from "@blueprintjs/core";

import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <Button
      intent={Intent.PRIMARY}
      style={{ color: "black", width: "120px" }}
      icon="globe"
      disabled={
        fee <= 0 ||
        amount <= 0 ||
        spendable < amount + fee ||
        !isAddressValid ||
        !inputsSelected
      }
      onClick={onSendButtonClickedCb}
    >
      {t("send")}
    </Button>
  );
};
