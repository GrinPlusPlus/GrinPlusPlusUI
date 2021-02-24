import { Checkbox, Radio, RadioGroup } from "@blueprintjs/core";

import React from "react";
import { useTranslation } from "react-i18next";

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

export const CoinControlComponent = ({
  strategy,
  inputsTable,
  inputs,
  setStrategyCb,
  updateInputsCb,
}: CoinControlProps) => {
  const { t } = useTranslation();

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
    const table: JSX.Element[] = inputsList.map((input) => {
      return (
        <tr
          id={input.commitment}
          key={input.commitment}
          style={{ fontFamily: "Courier New" }}
          onClick={() => {
            if (strategy === "SMALLEST") return;
            updateInputsCb(input.commitment);
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (strategy === "SMALLEST") return;
                  updateInputsCb(event.target.id);
                  event.preventDefault();
                }}
              />
            </div>
          </td>
          <td>{input.block_height}</td>
          <td>{input.commitment}</td>
          <td>{(input.amount / Math.pow(10, 9)).toFixed(9)}</td>
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
        label={t("strategy")}
        name="strategy"
        selectedValue={strategy}
        onChange={(event: React.FormEvent<HTMLInputElement>) => {
          setStrategyCb(event.currentTarget.value);
        }}
      >
        <Radio label={t("default")} value="SMALLEST" />
        <Radio label={t("custom")} value="CUSTOM" />
      </RadioGroup>
      <br />
      <div style={{ height: "calc(100vh - 400px)", overflowY: "auto" }}>
        <table className="transactions">
          <tbody>
            <tr>
              <th></th>
              <th>{t("height")}</th>
              <th>{t("commitment")}</th>
              <th>{t("amount")}</th>
            </tr>
            {listInputs(inputsTable)}
          </tbody>
        </table>
      </div>
    </div>
  );
};
