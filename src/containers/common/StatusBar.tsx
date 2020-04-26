import React, { useCallback, useEffect } from 'react';
import StatusBarComponent from '../../components/shared/StatusBar';
import { useStoreActions, useStoreState } from '../../hooks';

export default function StatusBarContainer() {
  const {
    intent,
    status,
    headers,
    blocks,
    network,
    updateInterval,
  } = useStoreState((state) => state.nodeSummary);
  const { isNodeRunning } = useStoreState((state) => state.wallet);
  const { connectedPeers } = useStoreState((state) => state.nodeSummary);

  const { checkStatus, updateConnectedPeers } = useStoreActions(
    (actions) => actions.nodeSummary
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      await checkStatus();
    }, updateInterval);
    return () => clearInterval(interval);
  }, [checkStatus, isNodeRunning, updateInterval]);

  const _updateConnectedPeers = useCallback(async () => {
    await updateConnectedPeers();
  }, [updateConnectedPeers]);

  return (
    <StatusBarComponent
      intent={intent}
      status={status}
      headers={headers}
      blocks={blocks}
      network={network}
      onOpeningCb={_updateConnectedPeers}
      connectedPeers={connectedPeers}
    />
  );
}
