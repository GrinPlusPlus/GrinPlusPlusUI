import React from "react";
import { IPeer } from "../../interfaces/IPeer";
import { useTranslation } from "react-i18next";

export type ConnectedPeersProps = { peers: IPeer[] };

export const ConnectedPeersComponent = ({ peers }: ConnectedPeersProps) => {
  const { t } = useTranslation();

  return (
    <table
      className="transactions"
      style={{ width: "500px" }}
      data-testid="peer-table"
    >
      <tbody>
        <tr>
          <th>{t("address")}</th>
          <th>{t("agent")}</th>
          <th>{t("direction")}</th>
        </tr>
        {peers.map((peer: IPeer) => {
          return (
            <tr
              key={peer.address}
              style={{
                cursor: "default"
              }}
            >
              <td>{peer.address}</td>
              <td>{peer.agent}</td>
              <td>{peer.direction}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
