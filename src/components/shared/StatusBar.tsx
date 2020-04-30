import React, { useCallback } from "react";
import { Icon } from "@blueprintjs/core";
import { StatusBarContent } from "../../components/styled";

type StatusBarProps = {
  intent: "none" | "primary" | "success" | "warning" | "danger" | undefined;
  status: string;
  headers: number;
  blocks: number;
  network: { height: number; outbound: number; inbound: number };
  connectedPeers:
    | { address: string; agent: string; direction: string }[]
    | undefined;
};

export const StatusBarComponent = ({
  intent,
  status,
  network,
  connectedPeers,
}: StatusBarProps) => {
  const renderGonnectedPeers = useCallback(() => {
    let table: JSX.Element[] = [];
    if (connectedPeers === undefined) return table;
    table = connectedPeers.map((peer) => {
      return (
        <tr
          key={peer.address}
          style={{
            fontSize: "12px",
          }}
        >
          <td>
            <Icon icon="dot" />
          </td>
          <td>{peer.address}</td>
          <td>{peer.agent}</td>
          <td>{peer.direction}</td>
        </tr>
      );
    });
    return table;
  }, [connectedPeers]);

  return (
    <StatusBarContent>
      <div style={{ paddingLeft: "10px", width: "40%" }}>
        <div>
          <Icon icon="symbol-circle" intent={intent} /> <b>STATUS:</b> {status}
        </div>
      </div>
      <div style={{ textAlign: "right", width: "60%", paddingRight: "35px" }}>
        <div>
          {network?.outbound} <Icon icon="arrow-up" />
          {"  "}
          {network?.inbound} <Icon icon="arrow-down" />
        </div>
      </div>
    </StatusBarContent>
  );
};
