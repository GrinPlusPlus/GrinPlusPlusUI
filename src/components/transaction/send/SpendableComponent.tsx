import React from "react";
import { Content } from "../../styled";

type SpendableProps = {
  spendable: number;
};

export const SpendableComponent = ({ spendable }: SpendableProps) => {
  return (
    <Content>
      Spendable :
      <b style={{ marginLeft: "10px" }}>{`${spendable.toFixed(6)} ツ`}</b>
    </Content>
  );
};
