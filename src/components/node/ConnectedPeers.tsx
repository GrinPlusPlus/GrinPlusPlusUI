import React from "react";
import { IPeer } from "../../interfaces/IPeer";

export type ConnectedPeersProps = { peers: IPeer[] };

export const ConnectedPeersComponent = ({ peers }: ConnectedPeersProps) => {
  return (
    <table
      className="transactions"
      style={{ width: "500px" }}
      data-testid="peer-table"
    >
      <tbody>
        <tr>
          <th>Address</th>
          <th>Agent</th>
          <th>Direction</th>
        </tr>
        {peers.map((peer: IPeer) => {
          return (
            <tr
              key={peer.address}
              style={{
                cursor: "default",
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
