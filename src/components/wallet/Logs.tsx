import { LogsBox } from "../styled";
import React from "react";

export type WalletLogsProps = { logs: string };

export const WalletLogsComponent = ({ logs }: WalletLogsProps) => {
  return <LogsBox>{logs}</LogsBox>;
};
