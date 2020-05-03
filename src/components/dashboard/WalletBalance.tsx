import NumberFormat from 'react-number-format';
import React from 'react';
import { BalanceSuffix, Flex, SpendableBalance } from '../styled';
import { Text, Tooltip } from '@blueprintjs/core';

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
  locked,
}: WalletBalanceProps) => {
  return (
    <div>
      <Text>Spendable:</Text>
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
              Total:{" "}
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
              Immature:{" "}
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
              Unconfirmed:{" "}
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
              Locked:{" "}
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
