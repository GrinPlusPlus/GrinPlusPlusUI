import React, { Suspense } from "react";
import { useStoreActions } from "../../hooks";

import { useTranslation } from "react-i18next";
import { HorizontallyCenter } from "../../components/styled";
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

export const NodeLogsContainer = () => {
  const { t } = useTranslation();
  const { readNodeLogs } = useStoreActions((state) => state.nodeSummary);

  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer title={t("node_logs")} />
      <div className="content">
        <div style={{ width: "100%", height: "calc(100vh - 130px)" }}>
          <TextFileComponent content={readNodeLogs()} />
        </div>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
