import React from "react";

import { RendererLogsBox } from "../styled";

export type RendererLogsProps = { logs: string };

export const RendererLogsComponent = ({ logs }: RendererLogsProps) => {
  return <RendererLogsBox value={logs} readOnly={true} />;
};
