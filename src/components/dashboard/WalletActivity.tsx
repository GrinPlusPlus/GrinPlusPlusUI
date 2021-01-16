import { Tab, Tabs } from "@blueprintjs/core";

import { ITransaction } from "../../interfaces/ITransaction";
import React from "react";
import { Title } from "../styled";
import { TransactionsTableComponent } from "../shared/TransactionsTable";
import { useTranslation } from "react-i18next";

type WalletActivityProps = {
  all: ITransaction[];
  received: ITransaction[];
  sent: ITransaction[];
  notFinalized: ITransaction[];
  canceled: ITransaction[];
  coinbase: ITransaction[];
  transactionOpened: number;
  openTransactionCb: (transactionId: number) => void;
  onCancelTransactionButtonClickedCb: (transactionId: number) => void;
  onRepostTransactionButtonClickedCb: (
    transactionId: number,
    method: string
  ) => void;
  onViewSlatepackMessageButtonClickedCb: (transactionId: number) => void;
  method: string;
  lastConfirmedHeight: number;
  confirmations: number;
};

export const WalletActivityComponent = ({
  all,
  received,
  sent,
  notFinalized,
  canceled,
  coinbase,
  transactionOpened,
  openTransactionCb,
  onCancelTransactionButtonClickedCb,
  onRepostTransactionButtonClickedCb,
  onViewSlatepackMessageButtonClickedCb,
  method,
  lastConfirmedHeight,
  confirmations,
}: WalletActivityProps) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: "10px" }}>
      <Tabs
        animate={false}
        id="WalletTabs"
        renderActiveTabPanelOnly={true}
        vertical={false}
      >
        <Tab
          id="in_progress"
          key="in_progress"
          title={t("in_progress")}
          style={{ fontSize: "17px" }}
          panel={
            <TransactionsTableComponent
              transactions={notFinalized}
              transactionOpened={transactionOpened}
              openTransactionCb={openTransactionCb}
              onCancelTransactionButtonClickedCb={
                onCancelTransactionButtonClickedCb
              }
              onRepostTransactionButtonClickedCb={
                onRepostTransactionButtonClickedCb
              }
              onViewSlatepackMessageButtonClickedCb={
                onViewSlatepackMessageButtonClickedCb
              }
              method={method}
              lastConfirmedHeight={lastConfirmedHeight}
              confirmations={confirmations}
            />
          }
        />
        <Tabs.Expander />
        <Tab
          id="received"
          key="received"
          title={t("received")}
          style={{ fontSize: "17px" }}
          panel={
            <TransactionsTableComponent
              transactions={received}
              transactionOpened={transactionOpened}
              openTransactionCb={openTransactionCb}
              onCancelTransactionButtonClickedCb={
                onCancelTransactionButtonClickedCb
              }
              onRepostTransactionButtonClickedCb={
                onRepostTransactionButtonClickedCb
              }
              onViewSlatepackMessageButtonClickedCb={
                onViewSlatepackMessageButtonClickedCb
              }
              method={method}
              lastConfirmedHeight={lastConfirmedHeight}
              confirmations={confirmations}
            />
          }
        />
        <Tab
          id="sent"
          key="sent"
          title={t("sent")}
          style={{ fontSize: "17px" }}
          panel={
            <TransactionsTableComponent
              transactions={sent}
              transactionOpened={transactionOpened}
              openTransactionCb={openTransactionCb}
              onCancelTransactionButtonClickedCb={
                onCancelTransactionButtonClickedCb
              }
              onRepostTransactionButtonClickedCb={
                onRepostTransactionButtonClickedCb
              }
              onViewSlatepackMessageButtonClickedCb={
                onViewSlatepackMessageButtonClickedCb
              }
              method={method}
              lastConfirmedHeight={lastConfirmedHeight}
              confirmations={confirmations}
            />
          }
        />
        <Tab
          id="cancelled"
          key="cancelled"
          title={t("canceled")}
          style={{ fontSize: "17px" }}
          panel={
            <TransactionsTableComponent
              transactions={canceled}
              transactionOpened={transactionOpened}
              openTransactionCb={openTransactionCb}
              onCancelTransactionButtonClickedCb={
                onCancelTransactionButtonClickedCb
              }
              onRepostTransactionButtonClickedCb={
                onRepostTransactionButtonClickedCb
              }
              onViewSlatepackMessageButtonClickedCb={
                onViewSlatepackMessageButtonClickedCb
              }
              method={method}
              lastConfirmedHeight={lastConfirmedHeight}
              confirmations={confirmations}
            />
          }
        />
        <Tab
          id="coinbase"
          key="coinbase"
          title={t("coinbase")}
          style={{ fontSize: "17px" }}
          panel={
            <TransactionsTableComponent
              transactions={coinbase}
              transactionOpened={transactionOpened}
              openTransactionCb={openTransactionCb}
              onCancelTransactionButtonClickedCb={
                onCancelTransactionButtonClickedCb
              }
              onRepostTransactionButtonClickedCb={
                onRepostTransactionButtonClickedCb
              }
              onViewSlatepackMessageButtonClickedCb={
                onViewSlatepackMessageButtonClickedCb
              }
              method={method}
              lastConfirmedHeight={lastConfirmedHeight}
              confirmations={confirmations}
            />
          }
        />
        <Tab
          id="all"
          key="all"
          title={t("all")}
          style={{ fontSize: "17px" }}
          panel={
            <TransactionsTableComponent
              transactions={all}
              transactionOpened={transactionOpened}
              openTransactionCb={openTransactionCb}
              onCancelTransactionButtonClickedCb={
                onCancelTransactionButtonClickedCb
              }
              onRepostTransactionButtonClickedCb={
                onRepostTransactionButtonClickedCb
              }
              onViewSlatepackMessageButtonClickedCb={
                onViewSlatepackMessageButtonClickedCb
              }
              method={method}
              lastConfirmedHeight={lastConfirmedHeight}
              confirmations={confirmations}
            />
          }
        />
      </Tabs>
    </div>
  );
};
