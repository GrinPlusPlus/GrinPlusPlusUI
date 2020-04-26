import ConnectedPeersComponent from '../../components/node/ConnectedPeers';
import React, { useCallback } from 'react';
import { Icon, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { StatusBarContent } from '../../components/styled';

type StatusBarProps = {
  intent: "none" | "primary" | "success" | "warning" | "danger" | undefined;
  status: string;
  headers: number;
  blocks: number;
  network: { height: number; outbound: number; inbound: number };
  connectedPeers:
    | { address: string; agent: string; direction: string }[]
    | undefined;
  onOpeningCb: () => void;
};

export default function StatusBarComponent({
  intent,
  status,
  headers,
  blocks,
  network,
  connectedPeers,
  onOpeningCb,
}: StatusBarProps) {
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
        <Popover
          className="bp3-dark"
          interactionKind={PopoverInteractionKind.HOVER}
        >
          <div>
            <Icon icon="symbol-circle" intent={intent} /> <b>STATUS:</b>{" "}
            {status}
          </div>
          <table>
            <tbody>
              <tr>
                <td>Headers:</td>
                <td>
                  <b>{headers?.toLocaleString()}</b>
                </td>
              </tr>
              <tr>
                <td>Blocks:</td>
                <td>
                  <b>{blocks?.toLocaleString()}</b>
                </td>
              </tr>
              <tr>
                <td>Network:</td>
                <td>
                  <b>{network?.height?.toLocaleString()}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </Popover>
      </div>
      <div style={{ textAlign: "right", width: "60%", paddingRight: "35px" }}>
        <Popover
          className="bp3-dark"
          content={<ConnectedPeersComponent peers={renderGonnectedPeers()} />}
          interactionKind={PopoverInteractionKind.HOVER}
          onOpening={onOpeningCb}
        >
          <div>
            {network?.outbound} <Icon icon="arrow-up" />
            {"  "}
            {network?.inbound} <Icon icon="arrow-down" />
          </div>
        </Popover>
      </div>
    </StatusBarContent>
  );
}
