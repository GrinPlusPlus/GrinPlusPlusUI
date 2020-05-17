import { Alert, Intent } from "@blueprintjs/core";
import React, { Suspense } from "react";

import { useHistory } from "react-router-dom";
import { useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

const StatusBarComponent = React.lazy(() =>
  import("../../components/shared/StatusBar").then(module => ({
    default: module.StatusBarComponent
  }))
);

const renderLoader = () => null;

export const StatusBarContainer = () => {
  const { intent, status, headers, blocks, network } = useStoreState(
    state => state.nodeSummary
  );
  const { nodeHealthCheck } = useStoreState(state => state.wallet);

  let history = useHistory();

  const { t } = useTranslation();

  return (
    <Suspense fallback={renderLoader()}>
      <Alert
        className="bp3-dark"
        confirmButtonText={t("restart_wallet")}
        isOpen={!nodeHealthCheck}
        intent={Intent.WARNING}
        onClose={() => history.push("/")}
      >
        <p>{t("node_process_not_running")}</p>
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
