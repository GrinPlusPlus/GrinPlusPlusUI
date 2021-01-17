import { Button, ButtonGroup, Icon, Intent } from "@blueprintjs/core";
import {
  cleanTxType,
  getDateAsString,
  getTxIcon,
  getTxIntent,
} from "../../helpers";

import { ITransaction } from "../../interfaces/ITransaction";
import React from "react";
import { TansactionDetailsComponent } from "../transaction/Details";
import { useTranslation } from "react-i18next";
import { HorizontallyCenter } from "../styled";

type TransactionsTableProps = {
  transactions: ITransaction[];
  transactionOpened: number;
  openTransactionCb: (transactionId: number) => void;
  onCancelTransactionButtonClickedCb: (transactionId: number) => void;
  onFinalizeTransactionButtonClickedCb: (transactionId: number) => void;
  onRepostTransactionButtonClickedCb: (
    transactionId: number,
    method: string
  ) => void;
  onViewSlatepackMessageButtonClickedCb: (transactionId: number) => void;
  method: string;
  lastConfirmedHeight: number;
  confirmations: number;
};

export const TransactionsTableComponent = ({
  transactions,
  transactionOpened,
  openTransactionCb,
  onCancelTransactionButtonClickedCb,
  onFinalizeTransactionButtonClickedCb,
  onRepostTransactionButtonClickedCb,
  onViewSlatepackMessageButtonClickedCb,
  method,
  lastConfirmedHeight,
  confirmations,
}: TransactionsTableProps) => {
  const { t } = useTranslation();

  const getStatus = (
    status: string,
    txHeight: number,
    lastHeight: number,
    confirms: number
  ): string => {
    if (["sent", "received"].includes(status)) {
      if (txHeight + (confirms - 1) > lastHeight) {
        return `${t(status)} (${lastHeight - txHeight + 1}/${confirms} ${t(
          "confirmations"
        )})`;
      }
      return t(status.toLowerCase());
    } else if (status === "sending_finalized") {
      return `${t("sending")} (${t("unconfirmed")})`;
    } else {
      return t(status);
    }
  };

  const listTransactions = (rows: ITransaction[]) => {
    let table: JSX.Element[] = [];
    if (rows.length === 0) return table;
    rows.forEach((transaction) => {
      let date =
        transaction.creationDate === undefined
          ? ""
          : getDateAsString(new Date(+transaction.creationDate * 1000));

      let mType = cleanTxType(transaction.type);

      table.push(
        <tr
          key={`i-${transaction.Id}`}
          onClick={() => openTransactionCb(transaction.Id)}
        >
          <td style={{ width: "5%", paddingLeft: "10px" }}>
            <HorizontallyCenter>
              <Icon icon={getTxIcon(mType)} intent={getTxIntent(mType)} />
            </HorizontallyCenter>
          </td>
          <td style={{ width: "10%", paddingLeft: "10px" }}>
            {Math.abs(
              transaction.amountCredited - transaction.amountDebited
            ).toFixed(9)}
          </td>
          <td style={{ width: "40%", paddingLeft: "10px" }}>
            {transaction.address === undefined ? "" : transaction.address}
          </td>
          <td style={{ width: "25%", paddingLeft: "10px" }}>
            {date === undefined ? "" : date}
          </td>

          <td>
            {mType === "sending_not_finalized" ? (
              <HorizontallyCenter>
                <ButtonGroup minimal={true}>
                  <Button
                    intent={Intent.PRIMARY}
                    icon="tick"
                    onClick={() =>
                      onFinalizeTransactionButtonClickedCb(transaction.Id)
                    }
                  >
                    {t("finalize")}
                  </Button>
                </ButtonGroup>
              </HorizontallyCenter>
            ) : null}
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
            {transactionOpened === transaction.Id ? (
              <TansactionDetailsComponent
                id={transaction.Id}
                key={transaction.Id}
                address={transaction.address ? transaction.address : "-"}
                slate={transaction.slateId}
                type={getStatus(
                  mType,
                  transaction.confirmedHeight,
                  lastConfirmedHeight,
                  confirmations
                )}
                mType={mType}
                message={
                  transaction.slateMessage ? transaction.slateMessage : "n/a"
                }
                fee={transaction.fee ? transaction.fee.toFixed(9) : "n/a"}
                date={
                  transaction.creationDate === undefined
                    ? "n/a"
                    : new Date(
                        +transaction.creationDate * 1000
                      ).toLocaleString()
                }
                kernels={transaction.kernels}
                outputs={transaction.outputs}
                method={method}
                onCancelTransactionButtonClickedCb={
                  onCancelTransactionButtonClickedCb
                }
                onRepostTransactionButtonClickedCb={
                  onRepostTransactionButtonClickedCb
                }
                onViewSlatepackMessageButtonClickedCb={
                  onViewSlatepackMessageButtonClickedCb
                }
              />
            ) : null}
          </td>
        </tr>
      );
    });
    return table;
  };

  return (
    <div
      style={{
        height: "calc(100vh - 380px)",
        overflowY: "auto",
      }}
    >
      {transactions.length === 0 ? (
        <HorizontallyCenter>
          <p style={{ color: "#a3a3a3", fontSize: "15px", marginTop: "50px" }}>
            {t("no_transactions")}.
          </p>
        </HorizontallyCenter>
      ) : (
        <table className="transactions">
          <tbody>
            <tr style={{ cursor: "default" }}>
              <th></th>
              <th style={{ paddingLeft: "10px" }}>{t("amount")} ツ</th>
              <th style={{ paddingLeft: "10px" }}>{t("address")}</th>
              <th style={{ paddingLeft: "10px" }}>{t("date")}</th>
              <th style={{ paddingLeft: "10px" }}></th>
            </tr>
            {listTransactions(transactions)}
          </tbody>
        </table>
      )}
    </div>
  );
};
