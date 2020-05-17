import { Content } from "../../styled";
import React from "react";
import { useTranslation } from "react-i18next";

type SpendableProps = {
  spendable: number;
};

export const SpendableComponent = ({ spendable }: SpendableProps) => {
  const { t } = useTranslation();
  return (
    <Content>
      {t("spendable")} :
      <b style={{ marginLeft: "10px" }}>{`${spendable.toFixed(9)} ツ`}</b>
    </Content>
  );
};
