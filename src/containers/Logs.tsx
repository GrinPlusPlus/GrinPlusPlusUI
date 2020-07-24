import React, { Suspense } from "react";

import { HorizontallyCenter } from "../components/styled";
import { LoadingComponent } from "../components/extras/Loading";
import { useTranslation } from "react-i18next";

const NavigationBarContainer = React.lazy(() =>
  import("./common/NavigationBar").then((module) => ({
    default: module.NavigationBarContainer,
  }))
);

const WalletLogsContainer = React.lazy(() =>
  import("./wallet/Logs").then((module) => ({
    default: module.WalletLogsContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const LogsContainer = () => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer title={t("logs")} />
      <div className="content">
        <HorizontallyCenter>
          <WalletLogsContainer />
        </HorizontallyCenter>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
