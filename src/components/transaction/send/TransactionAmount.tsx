import React from "react";
import { Flex } from "../../styled";
import { FormGroup, InputGroup } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

type TransactionAmountProps = {
  amount: string;
  fee: number;
  spendable: number;
  onAmountChangeCb: (amount: string) => void;
};

export const TransactionAmountComponent = ({
  amount,
  fee,
  spendable,
  onAmountChangeCb,
}: TransactionAmountProps) => {
  const { t } = useTranslation();

  return (
    <Flex>
      <FormGroup label={`${t("amount")}:`} labelFor="amount" inline={true}>
        <InputGroup
          className="bp3-dark"
          data-testid="send-using-file-amount-field"
          id="amount"
          type="number"
          placeholder={`${t("amount")} ツ`}
          value={amount}
          disabled={spendable === 0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onAmountChangeCb(e.target.value);
          }}
          style={{
            width: "200px",
            backgroundColor: "#21242D",
          }}
        />
      </FormGroup>
      <FormGroup
        label={`${t("fee")}:`}
        labelFor="fee"
        inline={true}
        style={{
          marginLeft: "15px",
        }}
      >
        <InputGroup
          className="bp3-dark"
          id="fee"
          disabled={true}
          readOnly={true}
          value={fee === 0 || !amount ? "" : `${fee.toFixed(9)}`}
          onChange={() => {}}
          style={{ width: "120px", backgroundColor: "#21242D" }}
        />
      </FormGroup>
    </Flex>
  );
};
