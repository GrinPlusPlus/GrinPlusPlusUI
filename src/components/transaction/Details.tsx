import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

export type TansactionDetailsProps = {
  id: number;
  address: string;
  slate: string;
  type: string;
  mType: string;
  message: string;
  fee: string;
  date: string;
  onCancelTransactionButtonClickedCb: (transactionId: number) => void;
  onRepostTransactionButtonClickedCb: (transactionId: number) => void;
};

export const TansactionDetailsComponent = ({
  id,
  address,
  slate,
  type,
  mType,
  message,
  fee,
  date,
  onCancelTransactionButtonClickedCb,
  onRepostTransactionButtonClickedCb,
}: TansactionDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        padding: "5px",
      }}
    >
      <div className="divTable">
        <div className="divTableBody">
          <div className="divTableRow">
            <div className="divTableCell">{t("id")}</div>
            <div className="divTableCell">
              <b data-testid="id">{id}</b>
            </div>
          </div>
          <div className="divTableRow">
            <div className="divTableCell">{t("address")}</div>
            <div className="divTableCell">
              <b data-testid="address">{address}</b>
            </div>
          </div>
          <div className="divTableRow">
            <div className="divTableCell">{t("slate")}</div>
            <div className="divTableCell">
              <b data-testid="slate">{slate}</b>
            </div>
          </div>
          <div className="divTableRow">
            <div className="divTableCell">{t("type")}</div>
            <div className="divTableCell">
              <b data-testid="type">{type}</b>
            </div>
          </div>
          <div className="divTableRow">
            <div className="divTableCell">{t("message")}</div>
            <div className="divTableCell">
              <b data-testid="message">{message}</b>
            </div>
          </div>
          <div className="divTableRow">
            <div className="divTableCell">{t("fee")}</div>
            <div className="divTableCell">
              <b data-testid="fee">{fee}</b>
            </div>
          </div>
          <div className="divTableRow">
            <div className="divTableCell">{t("date")}</div>
            <div className="divTableCell">
              <b data-testid="date">{date}</b>
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        {["sending_not_finalized", "receiving_unconfirmed"].includes(mType) ? (
          <Button
            text="Cancel Transaction"
            minimal={true}
            intent={Intent.WARNING}
            onClick={() => onCancelTransactionButtonClickedCb(id)}
          />
        ) : mType === "sending_finalized" ? (
          <Button
            text="Repost Transaction"
            minimal={true}
            intent={Intent.WARNING}
            onClick={() => onRepostTransactionButtonClickedCb(id)}
          />
        ) : null}
      </div>
    </div>
  );
};
