import React, { Suspense } from "react";
import { useStoreActions } from "../../hooks";

import { useTranslation } from "react-i18next";
import { LoadingComponent } from "../../components/extras/Loading";

const NavigationBarContainer = React.lazy(() =>
  import("../common/NavigationBar").then((module) => ({
    default: module.NavigationBarContainer,
  }))
);

const TextFileComponent = React.lazy(() =>
  import("./../../components/extras/TextFile").then((module) => ({
    default: module.TextFileComponent,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("../common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const WalletLogsContainer = () => {
  const { t } = useTranslation();
  const { readWalletLogs } = useStoreActions((state) => state.nodeSummary);

  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer title={t("wallet_logs")} />
      <div className="content">
        <TextFileComponent content={readWalletLogs()} />
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
