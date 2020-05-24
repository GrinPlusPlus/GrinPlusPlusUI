import { BalanceSuffix, Flex, SpendableBalance } from "../styled";
import { Text, Tooltip } from "@blueprintjs/core";

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
      <Text>{t("spendable")}:</Text>
      <Flex>
        <SpendableBalance>
          <NumberFormat
            data-testid="spendable"
            value={spendable}
            displayType={"text"}
            thousandSeparator={true}
            decimalScale={9}
            fixedDecimalScale={true}
          />
        </SpendableBalance>
        <Tooltip>
          <BalanceSuffix>ツ</BalanceSuffix>
        </Tooltip>
      </Flex>
    </div>
  );
};
