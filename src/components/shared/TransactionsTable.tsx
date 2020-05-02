import React from 'react';
import {
  cleanTxType,
  cutAdddres,
  getTxIcon,
  getTxIntent
  } from '../../helpers';
import { Icon, Text } from '@blueprintjs/core';
import { ITransaction } from '../../interfaces/ITransaction';
import { TansactionDetailsComponent } from '../transaction/Details';

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
    if (rows.length === 0) return table;
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
          <td style={{ width: "20%", paddingLeft: "10px" }}>
            {Math.abs(
              transaction.amountCredited - transaction.amountDebited
            ).toFixed(6)}
          </td>
          <td style={{ width: "25%", paddingLeft: "10px" }}>
            {transaction.address === undefined
              ? ""
              : cutAdddres(transaction.address)}
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
            <TansactionDetailsComponent
              id={transaction.Id}
              address={transaction.address ? transaction.address : "-"}
              slate={transaction.slateId}
              type={transaction.type}
              mType={mType}
              message={
                transaction.slateMessage ? transaction.slateMessage : "n/a"
              }
              fee={transaction.fee.toFixed(6)}
              date={`${date.substring(0, 10)} ${date.substring(
                date.length - 8
              )}`}
              onCancelTransactionButtonClickedCb={
                onCancelTransactionButtonClickedCb
              }
              onRepostTransactionButtonClickedCb={
                onRepostTransactionButtonClickedCb
              }
            />
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
        <Text>There is no transactions to display.</Text>
      ) : (
        <table className="transactions">
          <tbody>
            <tr style={{ cursor: "default" }}>
              <th style={{ paddingLeft: "10px" }}></th>
              <th style={{ paddingLeft: "10px" }}>Amount ツ</th>
              <th style={{ paddingLeft: "10px" }}>Address</th>
            </tr>
            {listTransactions(transactions)}
          </tbody>
        </table>
      )}
    </div>
  );
};
