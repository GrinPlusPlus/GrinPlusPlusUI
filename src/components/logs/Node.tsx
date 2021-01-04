import React from "react";

import { NodeLogsBox } from "../styled";

export type NodeLogsProps = { logs: string };

export const NodeLogsComponent = ({ logs }: NodeLogsProps) => {
  return <NodeLogsBox value={logs} readOnly={true} />;
};
