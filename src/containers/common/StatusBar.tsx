import React, { Suspense } from "react";
import { Alert, Intent } from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../../hooks";

const StatusBarComponent = React.lazy(() =>
  import("../../components/shared/StatusBar").then((module) => ({
    default: module.StatusBarComponent,
  }))
);

const renderLoader = () => null;

export const StatusBarContainer = () => {
  const { intent, status, headers, blocks, network } = useStoreState(
    (state) => state.nodeSummary
  );
  const { nodeHealthCheck } = useStoreState((state) => state.wallet);

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
