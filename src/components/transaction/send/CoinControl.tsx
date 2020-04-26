import React from 'react';
import { Checkbox, Radio, RadioGroup } from '@blueprintjs/core';

type CoinControlProps = {
  strategy: string;
  inputsTable: {
    amount: number;
    block_height: number;
    commitment: string;
    keychain_path: string;
    status: string;
    transaction_id: number;
  }[];
  inputs: string[];
  setStrategyCb: (strategy: string) => void;
  updateInputsCb: (commitment: string) => void;
};

export default function CoinControlComponent({
  strategy,
  inputsTable,
  inputs,
  setStrategyCb,
  updateInputsCb,
}: CoinControlProps) {
  const listInputs = (
    inputsList: {
      amount: number;
      block_height: number;
      commitment: string;
      keychain_path: string;
      status: string;
      transaction_id: number;
    }[]
  ) => {
    let table: JSX.Element[] = inputsList.map((input) => {
      return (
        <tr
          id={input.commitment}
          key={input.commitment}
          onClick={(
            event: React.MouseEvent<HTMLTableRowElement, MouseEvent>
          ) => {
            if (strategy === "SMALLEST") return;
            let target = event.target as HTMLTableRowElement;
            if (target.parentElement?.id)
              updateInputsCb(target.parentElement.id);
          }}
        >
          <td>
            <div>
              <Checkbox
                style={{
                  margin: "0 auto",
                  verticalAlign: "bottom",
                  bottom: "0",
                  right: "0",
                }}
                id={input.commitment}
                key={input.commitment}
                checked={inputs.includes(input.commitment)}
                disabled={strategy === "SMALLEST"}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  let target = event.target as HTMLInputElement;
                  updateInputsCb(target.id);
                }}
              />
            </div>
          </td>
          <td>{input.block_height}</td>
          <td>{input.commitment}</td>
          <td>{(input.amount / Math.pow(10, 9)).toFixed(6)}</td>
        </tr>
      );
    });
    return table;
  };

  return (
    <div>
      <RadioGroup
        className="bp3-dark"
        inline={true}
        label="Strategy"
        name="strategy"
        selectedValue={strategy}
        onChange={(event: React.FormEvent<HTMLInputElement>) => {
          let target = event.target as HTMLInputElement;
          setStrategyCb(target.value);
        }}
      >
        <Radio label="Default" value="SMALLEST" />
        <Radio label="Custom" value="CUSTOM" />
      </RadioGroup>
      <br />
      <div
        style={{
          minHeight: "345px",
          maxHeight: "345px",
          width: "100%",
          overflowY: "auto",
        }}
      >
        <table
          className="transactions"
          style={{ fontFamily: "Courier New", fontWeight: "bold" }}
        >
          <tbody>
            <tr>
              <th></th>
              <th>Height</th>
              <th>Commitment</th>
              <th>Amount</th>
            </tr>
            {listInputs(inputsTable)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
