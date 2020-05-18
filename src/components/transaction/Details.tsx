import { Button, Intent } from "@blueprintjs/core";

import React from "react";
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
  method: string;
  onCancelTransactionButtonClickedCb: (transactionId: number) => void;
  onRepostTransactionButtonClickedCb: (
    transactionId: number,
    method: string
  ) => void;
  kernels?: string[];
  outputs?: {
    amount: number;
    commitment: string;
  }[];
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
  method,
  onCancelTransactionButtonClickedCb,
  onRepostTransactionButtonClickedCb,
  kernels,
  outputs,
}: TansactionDetailsProps) => {
  const { t } = useTranslation();

  const listKernels = (kernels: string[] | undefined) => {
    let elements: JSX.Element[] = [];
    if (kernels && kernels.length > 0) {
      elements = kernels.map((kernel: string) => {
        return (
          <p key={kernel}>
            <Button
              className="bp3-dark"
              intent={Intent.NONE}
              minimal={true}
              rightIcon="duplicate"
              text={kernel.replace(
                kernel.substr(
                  kernel.length / 2 - kernel.length / 4,
                  (kernel.length / 4) * 2
                ),
                ".........."
              )}
              onClick={() => navigator.clipboard.writeText(kernel)}
            />
          </p>
        );
      });
    }
    return elements;
  };
  const listOutputs = (
    outputs:
      | {
          amount: number;
          commitment: string;
        }[]
      | undefined
  ) => {
    let elements: JSX.Element[] = [];
    if (outputs && outputs.length > 0) {
      elements = outputs.map(
        (output: { amount: number; commitment: string }) => {
          return (
            <div key={output.commitment}>
              <p>
                {t("amount")}: <b>{output.amount}</b>
              </p>
              <p>
                {t("commitment")}:{" "}
                <Button
                  className="bp3-dark"
                  intent={Intent.NONE}
                  minimal={true}
                  rightIcon="duplicate"
                  text={output.commitment.replace(
                    output.commitment.substr(
                      output.commitment.length / 2 -
                        output.commitment.length / 3,
                      (output.commitment.length / 3) * 2
                    ),
                    ".........."
                  )}
                  onClick={() =>
                    navigator.clipboard.writeText(output.commitment)
                  }
                />
              </p>
              <p> </p>
            </div>
          );
        }
      );
    }
    return elements;
  };
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
          <div className="divTableRow">
            <div className="divTableCell">{t("kernels")}</div>
            <div className="divTableCell">{listKernels(kernels)}</div>
          </div>
          <div className="divTableRow">
            <div className="divTableCell">{t("outputs")}</div>
            <div className="divTableCell">{listOutputs(outputs)}</div>
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
            onClick={() => onRepostTransactionButtonClickedCb(id, method)}
          />
        ) : null}
      </div>
    </div>
  );
};
