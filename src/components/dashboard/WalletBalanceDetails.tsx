import NumberFormat from "react-number-format";
import React from "react";
import { useTranslation } from "react-i18next";

export type WalletBalanceProps = {
  immature: number;
  locked: number;
};
export const WalletBalanceDetailsComponent = ({
  immature,
  locked,
}: WalletBalanceProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <p>
        {t("immature")}:{" "}
        <strong>
          <NumberFormat
            data-testid="immature"
            value={immature.toLocaleString("en-US", {
              useGrouping: true,
              maximumSignificantDigits: 9,
            })}
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
            value={locked.toLocaleString("en-US", {
              useGrouping: true,
              maximumSignificantDigits: 9,
            })}
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
