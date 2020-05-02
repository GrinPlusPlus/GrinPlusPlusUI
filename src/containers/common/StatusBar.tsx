import React, { Suspense, useEffect } from 'react';
import { Alert, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
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
  } = useStoreState((state) => state.nodeSummary);
  const { nodeHealthCheck } = useStoreState((state) => state.wallet);
  const { checkStatus, updateStatus } = useStoreActions(
    (actions) => actions.nodeSummary
  );
  const { checkNodeHealth } = useStoreActions((actions) => actions.wallet);

  const getStatus = async () => {
    try {
      updateStatus(await checkStatus());
    } catch (error) {
      require("electron-log").error(
        `Error trying to get Node Status: ${error.message}`
      );
      updateStatus(undefined);
      require("electron-log").info("Performing HealthCheck...");
      try {
        await checkNodeHealth();
        require("electron-log").info("HealthCheck passed, all good!");
      } catch (error) {
        require("electron-log").error(`HealthCheck failed: ${error.message}`);
      }
    }
  };

  async function requestStatus() {
    await getStatus();
  }

  useEffect(() => {
    let timer = setTimeout(() => requestStatus(), updateInterval);
    return () => {
      clearTimeout(timer);
    };
  });

  let history = useHistory();

  return (
    <Suspense fallback={renderLoader()}>
      <Alert
        className="bp3-dark"
        confirmButtonText="Restart Wallet"
        isOpen={!nodeHealthCheck}
        intent={Intent.WARNING}
        onClose={() => history.push("/")}
      >
        <p>
          The Node process is not running. This is unusual, but don't worry, you
          just need to restart the wallet.
        </p>
      </Alert>
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
