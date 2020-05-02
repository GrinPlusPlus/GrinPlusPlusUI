import React from "react";
import { Icon } from "@blueprintjs/core";
import { StatusBarContent } from "../../components/styled";

type StatusBarProps = {
  intent: "none" | "primary" | "success" | "warning" | "danger" | undefined;
  status: string;
  headers: number;
  blocks: number;
  network: { height: number; outbound: number; inbound: number };
};

export const StatusBarComponent = ({
  intent,
  status,
  network,
}: StatusBarProps) => {
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
