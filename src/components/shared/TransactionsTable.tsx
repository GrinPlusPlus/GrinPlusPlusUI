import { Button, Icon, Intent, Text } from "@blueprintjs/core";
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
    const table: JSX.Element[] = [];
    if (rows.length === 0) return table;
    rows.forEach((transaction) => {
      const date =
        transaction.creationDate === undefined
          ? ""
          : getDateAsString(new Date(+transaction.creationDate * 1000));

      const mType = cleanTxType(transaction.type);

      table.push(
        <tr key={`i-${transaction.Id}`} style={{ height: "30px" }}>
          <td
            style={{ width: "5%", paddingLeft: "10px" }}
            onClick={() => openTransactionCb(transaction.Id)}
          >
            <HorizontallyCenter>
              <Icon icon={getTxIcon(mType)} intent={getTxIntent(mType)} />
            </HorizontallyCenter>
          </td>
          <td
            style={{ width: "12%", paddingLeft: "10px" }}
            onClick={() => openTransactionCb(transaction.Id)}
          >
            {Math.abs(
              transaction.amountCredited - transaction.amountDebited
            ).toFixed(9)}
          </td>
          <td
            style={{ width: "50%", paddingLeft: "10px" }}
            onClick={() => openTransactionCb(transaction.Id)}
          >
            {transaction.address === undefined ? "" : transaction.address}
          </td>
          <td
            style={{ width: "15%", paddingLeft: "10px" }}
            onClick={() => openTransactionCb(transaction.Id)}
          >
            {date === undefined ? "" : date}
          </td>

          <td style={{ width: "18%", paddingLeft: "10px" }}>
            {mType === "sending_not_finalized" ? (
              <Button
                style={{ margin: "0px", padding: "1px", height: "10px" }}
                minimal={true}
                small={true}
                intent={Intent.PRIMARY}
                icon="tick"
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.preventDefault();
                  onFinalizeTransactionButtonClickedCb(transaction.Id);
                }}
              >
                {t("finalize")}
              </Button>
            ) : (
              <Text>
                {getStatus(
                  mType,
                  transaction.confirmedHeight,
                  lastConfirmedHeight,
                  confirmations
                )}
              </Text>
            )}
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
