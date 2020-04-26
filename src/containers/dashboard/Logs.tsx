import LogsComponent from '../../components/dashboard/Logs';
import React from 'react';
import { useStoreState } from '../../hooks';

export default function LogsContainer() {
  const { logs } = useStoreState((actions) => actions.wallet);

  return <LogsComponent logs={logs} />;
}
