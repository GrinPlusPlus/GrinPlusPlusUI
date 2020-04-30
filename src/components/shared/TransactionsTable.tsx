import React from "react";
import { Button, Icon, Intent, Text } from "@blueprintjs/core";
import { cleanTxType, getTxIcon, getTxIntent } from "../../helpers";
import { ITransaction } from "../../interfaces/ITransaction";

type TransactionsTableProps = {
  transactions: ITransaction[];
  transactionOpened: number;
  openTransactionCb: (transactionId: number) => void;
  onCancelTransactionButtonClickedCb: (transactionId: number) => void;
  onRepostTransactionButtonClickedCb: (transactionId: number) => void;
};

export const TransactionsTableComponent = ({
  transactions,
  transactionOpened,
  openTransactionCb,
  onCancelTransactionButtonClickedCb,
  onRepostTransactionButtonClickedCb,
}: TransactionsTableProps) => {
  const listTransactions = (rows: ITransaction[]) => {
    let table: JSX.Element[] = [];
    rows.forEach((transaction) => {
      let date = new Date(+transaction.creationDate * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      let mType = cleanTxType(transaction.type);

      table.push(
        <tr
          key={`i-${transaction.Id}`}
          onClick={() => openTransactionCb(transaction.Id)}
        >
          <td style={{ width: "5%", paddingLeft: "10px" }}>
            <Icon icon={getTxIcon(mType)} intent={getTxIntent(mType)} />
          </td>
          <td style={{ width: "25%", paddingLeft: "10px" }}>
            {(transaction.amountCredited - transaction.amountDebited).toFixed(
              6
            )}
          </td>
          <td style={{ width: "20%", paddingLeft: "10px" }}>
            {Math.abs(transaction.fee).toFixed(6)}
          </td>
          <td style={{ width: "50%", paddingLeft: "10px" }}>
            {date.substring(0, 10)} {date.substring(date.length - 8)}
          </td>
        </tr>
      );
      table.push(
        <tr key={`e-${transaction.Id}`} style={{ display: "none" }}>
          <td colSpan={6}></td>
        </tr>
      );
      table.push(
        <tr
          key={`d-${transaction.Id}`}
          className={transactionOpened === transaction.Id ? "show " : "hide"}
        >
          <td
            colSpan={6}
            style={{
              backgroundColor: "black",
              cursor: "default",
            }}
          >
            <div
              style={{
                padding: "5px",
              }}
            >
              <p>
                ID: <b>{transaction.Id}</b>
              </p>
              <p>
                Address: <b>{transaction.address}</b>
              </p>
              <p>
                Slate: <b>{transaction.slateId}</b>
              </p>
              <p>
                Type: <b>{transaction.type}</b>
              </p>
              <p>
                Message:{" "}
                <b>
                  {transaction.slateMessage ? transaction.slateMessage : "n/a"}
                </b>
              </p>
              <p>
                Fee:
                <b> {transaction.fee}</b>
              </p>
              <div style={{ textAlign: "center" }}>
                {["sending_not_finalized", "receiving_unconfirmed"].includes(
                  mType
                ) ? (
                  <Button
                    text="Cancel Transaction"
                    minimal={true}
                    intent={Intent.WARNING}
                    onClick={() =>
                      onCancelTransactionButtonClickedCb(transaction.Id)
                    }
                  />
                ) : mType === "sending_finalized" ? (
                  <Button
                    text="Repost Transaction"
                    minimal={true}
                    intent={Intent.WARNING}
                    onClick={() =>
                      onRepostTransactionButtonClickedCb(transaction.Id)
                    }
                  />
                ) : null}
              </div>
            </div>
          </td>
        </tr>
      );
    });
    return table;
  };

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "555px",
        overflowY: "auto",
      }}
    >
      {transactions.length === 0 ? (
        <Text>There is no transactions for this Wallet.</Text>
      ) : (
        <table className="transactions">
          <tbody>
            <tr style={{ cursor: "default" }}>
              <th style={{ paddingLeft: "10px" }}></th>
              <th style={{ paddingLeft: "10px" }}>Amount ツ</th>
              <th style={{ paddingLeft: "10px" }}>Fee ツ</th>
              <th style={{ paddingLeft: "10px" }}>Date</th>
            </tr>
            {listTransactions(transactions)}
          </tbody>
        </table>
      )}
    </div>
  );
};
