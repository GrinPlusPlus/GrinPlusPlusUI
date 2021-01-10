import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import { useTranslation } from "react-i18next";

type SpendableProps = {
  spendable: number;
  onSendMaxButtonClickedCb: () => void;
};

export const SpendableComponent = ({
  spendable,
  onSendMaxButtonClickedCb,
}: SpendableProps) => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        fontSize: "14px",
        marginBottom: "8px",
        textAlign: "right",
        color: "gray",
      }}
    >
      {t("spendable")} :
      <b
        style={{ marginLeft: "10px", marginRight: "10px" }}
      >{`${spendable.toFixed(9)} ツ`}</b>
      <Button
        intent={Intent.PRIMARY}
        disabled={spendable > 0 ? false : true}
        style={{ color: "black" }}
        onClick={onSendMaxButtonClickedCb}
      >
        {t("send_max")}
      </Button>
    </div>
  );
};
