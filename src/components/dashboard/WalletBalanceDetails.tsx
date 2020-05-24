import NumberFormat from "react-number-format";
import React from "react";
import { useTranslation } from "react-i18next";

export type WalletBalanceProps = {
  total: number;
  immature: number;
  unconfirmed: number;
  locked: number;
};
export const WalletBalanceDetailsComponent = ({
  total,
  immature,
  unconfirmed,
  locked,
}: WalletBalanceProps) => {
  const { t } = useTranslation();

  return (
    <div>
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
        </strong>{" "}
        ツ
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
        </strong>{" "}
        ツ
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
        </strong>{" "}
        ツ
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
        </strong>{" "}
        ツ
      </p>
    </div>
  );
};
