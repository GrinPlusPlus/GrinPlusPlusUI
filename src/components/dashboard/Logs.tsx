import React from 'react';
import { LogsBox, Title } from '../styled';

export type LogsProps = { logs: string };

export default function LogsComponent({ logs }: LogsProps) {
  return (
    <div>
      <Title>Logs</Title>
      <LogsBox data-testid="logs-box">{logs}</LogsBox>
    </div>
  );
}
