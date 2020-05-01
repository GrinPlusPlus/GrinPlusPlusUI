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
    <table style={{ width: "100%" }}>
      <tbody>
        <tr>
          <td>
            <b>Headers</b>
          </td>
          <td>
            <b>Blocks</b>
          </td>
          <td>
            <b>Network</b>
          </td>
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
