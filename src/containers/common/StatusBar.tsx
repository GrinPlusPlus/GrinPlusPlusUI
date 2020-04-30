import React, { Suspense } from "react";
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

  const { checkStatus, updateStatus } = useStoreActions(
    (actions) => actions.nodeSummary
  );

  useInterval(async () => {
    await checkStatus()
      .then((status: INodeStatus) => updateStatus(status))
      .catch(() => updateStatus(undefined));
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
