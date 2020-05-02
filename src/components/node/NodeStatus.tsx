import React from "react";

export type NodeStatusProps = {
  headers: number;
  blocks: number;
  network: number;
};

export const NodeStatusComponent = ({
  headers,
  blocks,
  network,
}: NodeStatusProps) => {
  return (
    <table className="transactions" style={{ width: "500px" }}>
      <tbody>
        <tr>
          <th>
            <b>Headers</b>
          </th>
          <th>
            <b>Blocks</b>
          </th>
          <th>
            <b>Network</b>
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
