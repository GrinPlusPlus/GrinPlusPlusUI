import React, { Suspense } from 'react';
import { INodeStatus } from '../../interfaces/INodeStatus';
import { useInterval } from '../../helpers';
import { useStoreActions, useStoreState } from '../../hooks';

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
    waitingResponse,
  } = useStoreState((state) => state.nodeSummary);

  const { checkStatus, updateStatus, setWaitingResponse } = useStoreActions(
    (actions) => actions.nodeSummary
  );

  useInterval(async () => {
    if (waitingResponse) return;
    setWaitingResponse(true);
    await checkStatus()
      .then((status: INodeStatus) => { setWaitingResponse(false); updateStatus(status); })
      .catch(() => { setWaitingResponse(false); updateStatus(undefined);})
  }, updateInterval);

  return (
    <Suspense fallback={renderLoader()}>
      <StatusBarComponent
        intent={intent}
        status={status}
        headers={headers}
        blocks={blocks}
        network={network}
      />
    </Suspense>
  );
};
