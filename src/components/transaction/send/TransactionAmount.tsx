import React from "react";
import { Flex } from "../../styled";
import { FormGroup, InputGroup } from "@blueprintjs/core";

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
  return (
    <Flex>
      <FormGroup label="Amount" labelFor="amount" inline={true}>
        <InputGroup
          className="bp3-dark"
          data-testid="send-using-file-amount-field"
          id="amount"
          type="number"
          placeholder="Amount  ツ"
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
        label="Fee:"
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
          value={fee === 0 || !amount ? "" : `${fee.toFixed(6)}`}
          onChange={() => {}}
          style={{ width: "120px", backgroundColor: "#21242D" }}
        />
      </FormGroup>
    </Flex>
  );
};
