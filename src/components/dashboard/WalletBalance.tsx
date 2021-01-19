import { Flex, SpendableBalance, Title } from "../styled";

import NumberFormat from "react-number-format";
import React from "react";
import { useTranslation } from "react-i18next";

export type WalletBalanceProps = {
  spendable: number;
};
export const WalletBalanceComponent = ({ spendable }: WalletBalanceProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Title>{t("spendable")} ツ</Title>
      <Flex>
        <SpendableBalance>
          <NumberFormat
            data-testid="spendable"
            value={spendable.toLocaleString("en-US", {
              useGrouping: true,
              maximumSignificantDigits: 9,
            })}
            type={"text"}
            displayType={"text"}
            decimalScale={9}
            thousandSeparator={true}
            fixedDecimalScale={true}
          />
        </SpendableBalance>
      </Flex>
    </div>
  );
};
