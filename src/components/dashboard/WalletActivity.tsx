import React from 'react';
import { ITransaction } from '../../interfaces/ITransaction';
import { Tab, Tabs } from '@blueprintjs/core';
import { Title } from '../styled';
import { TransactionsTableComponent } from '../shared/TransactionsTable';
import { useTranslation } from 'react-i18next';

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
  onRepostTransactionButtonClickedCb: (transactionId: number) => void;
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
}: WalletActivityProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Title>{t("transactions")}</Title>
      <br />
      <Tabs
        animate={false}
        id="WalletTabs"
        renderActiveTabPanelOnly={true}
        vertical={false}
      >
        <Tab
          id="all"
          key="all"
          title={t("all")}
          style={{ fontSize: "16px" }}
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
            />
          }
        />
        <Tabs.Expander />
        <Tab
          id="received"
          key="received"
          title={t("received")}
          style={{ fontSize: "16px" }}
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
            />
          }
        />
        <Tab
          id="sent"
          key="sent"
          title={t("sent")}
          style={{ fontSize: "16px" }}
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
            />
          }
        />
        <Tab
          id="in_progress"
          key="in_progress"
          title={t("in_progress")}
          style={{ fontSize: "16px" }}
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
            />
          }
        />
        <Tab
          id="cancelled"
          key="cancelled"
          title={t("cancelled")}
          style={{ fontSize: "16px" }}
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
            />
          }
        />
        <Tab
          id="coinbase"
          key="coinbase"
          title={t("coinbase")}
          style={{ fontSize: "16px" }}
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
            />
          }
        />
      </Tabs>
    </div>
  );
};
