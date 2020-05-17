import NumberFormat from "react-number-format";
import React from "react";
import { BalanceSuffix, Flex, SpendableBalance } from "../styled";
import { Text, Tooltip } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

export type WalletBalanceProps = {
  total: number;
  spendable: number;
  immature: number;
  unconfirmed: number;
  locked: number;
};
export const WalletBalanceComponent = ({
  total,
  spendable,
  immature,
  unconfirmed,
  locked
}: WalletBalanceProps) => {
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
          <div data-testid="balance-tooltip">
            <p>
              {t("total")}:{" "}
              <strong>
                <NumberFormat
                  data-testid="total"
                  value={total}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={9}
                  fixedDecimalScale={true}
                />
              </strong>
            </p>
            <p>
              {t("immature")}:{" "}
              <strong>
                <NumberFormat
                  data-testid="immature"
                  value={immature}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={9}
                  fixedDecimalScale={true}
                />
              </strong>
            </p>
            <p>
              {t("unconfirmed")}:{" "}
              <strong>
                <NumberFormat
                  data-testid="unconfirmed"
                  value={unconfirmed}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={9}
                  fixedDecimalScale={true}
                />
              </strong>
            </p>
            <p>
              {t("locked")}:{" "}
              <strong>
                <NumberFormat
                  data-testid="locked"
                  value={locked}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={9}
                  fixedDecimalScale={true}
                />
              </strong>
            </p>
          </div>
        </Tooltip>
      </Flex>
    </div>
  );
};
