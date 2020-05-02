import React, { Suspense, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../hooks";

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
  const { checkNodeHealth } = useStoreActions((actions) => actions.wallet);

  const getStatus = async () => {
    try {
      const status = await checkStatus();
      updateStatus(status);
    } catch (error) {
      require("electron-log").info(
        `Error trying to get Node Status: ${error.message}`
      );
      updateStatus(undefined);
      require("electron-log").info("Performing HealthCheck...");
      try {
        await checkNodeHealth();
        require("electron-log").info("HealthCheck passed, all good!");
      } catch (error) {
        require("electron-log").info(`HealthCheck failed: ${error.message}`);
      }
    }
  };
  useEffect(() => {
    async function init() {
      await getStatus();
    }
    init();
    const interval = setInterval(async () => {
      await getStatus();
    }, updateInterval);
    return () => clearInterval(interval);
  });

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
