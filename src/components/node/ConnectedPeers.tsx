import React from "react";

type ConnectedPeersProps = { peers: JSX.Element[] };

export const ConnectedPeersComponent = ({ peers }: ConnectedPeersProps) => {
  return (
    <table style={{ width: "100%" }}>
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
        {peers}
      </tbody>
    </table>
  );
};
