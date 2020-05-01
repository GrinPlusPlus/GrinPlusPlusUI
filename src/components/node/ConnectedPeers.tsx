import React from "react";
import { IPeer } from "../../interfaces/IPeer";

export type ConnectedPeersProps = { peers: IPeer[] };

export const ConnectedPeersComponent = ({ peers }: ConnectedPeersProps) => {
  return (
    <table
      className="transactions"
      style={{ width: "100%" }}
      data-testid="peer-table"
    >
      <tbody>
        <tr>
          <td></td>
          <td>
            <b>Address</b>
          </td>
          <td>
            <b>Agent</b>
          </td>
          <td>
            <b>Direction</b>
          </td>
        </tr>
        {peers.map((peer: IPeer) => {
          return (
            <tr key={peer.address}>
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
