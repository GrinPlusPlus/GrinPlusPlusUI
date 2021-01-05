import React from "react";
import { useTranslation } from "react-i18next";

export type NodeStatusProps = {
  headers: number;
  blocks: number;
  network: number;
};

export const NodeStatusComponent = ({
  headers,
  blocks,
  network
}: NodeStatusProps) => {
  const { t } = useTranslation();

  return (
    <table className="transactions">
      <tbody>
        <tr>
          <th>
            <b>{t("headers")}</b>
          </th>
          <th>
            <b>{t("blocks")}</b>
          </th>
          <th>
            <b>{t("network")}</b>
          </th>
        </tr>
        <tr>
          <td data-testid="headers">{headers}</td>
          <td data-testid="blocks">{blocks}</td>
          <td data-testid="network">{network}</td>
        </tr>
      </tbody>
    </table>
  );
};
