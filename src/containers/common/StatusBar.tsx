import React, { useCallback, Suspense } from "react";
import { useStoreActions, useStoreState } from "../../hooks";
import { useInterval } from "../../helpers";
import { INodeStatus } from "../../interfaces/INodeStatus";

const StatusBarComponent = React.lazy(() =>
  import("../../components/shared/StatusBar").then((module) => ({
    default: module.StatusBarComponent,
  }))
);

const renderLoader = () => null;

export const StatusBarContainer = () => {
  const {
    intent,
    status,
    headers,
    blocks,
    network,
    updateInterval,
  } = useStoreState((state) => state.nodeSummary);
  const { connectedPeers } = useStoreState((state) => state.nodeSummary);

  const { checkStatus, updateConnectedPeers, updateStatus } = useStoreActions(
    (actions) => actions.nodeSummary
  );

  useInterval(() => {
    checkStatus()
      .then((status: INodeStatus) => updateStatus(status))
      .catch(() => updateStatus(undefined));
  }, updateInterval);

  const _updateConnectedPeers = useCallback(async () => {
    await updateConnectedPeers();
  }, [updateConnectedPeers]);

  return (
    <Suspense fallback={renderLoader()}>
      <StatusBarComponent
        intent={intent}
        status={status}
        headers={headers}
        blocks={blocks}
        network={network}
        onOpeningCb={_updateConnectedPeers}
        connectedPeers={connectedPeers}
      />
    </Suspense>
  );
};
