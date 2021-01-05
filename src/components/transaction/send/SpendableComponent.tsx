import React from "react";
import { useTranslation } from "react-i18next";

type SpendableProps = {
  spendable: number;
};

export const SpendableComponent = ({ spendable }: SpendableProps) => {
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
      <b style={{ marginLeft: "10px" }}>{`${spendable.toFixed(9)} ツ`}</b>
    </div>
  );
};
