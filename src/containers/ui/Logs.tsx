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

const renderLoader = () => <LoadingComponent />;

export const UILogsContainer = () => {
  const { t } = useTranslation();
  const { readUILogs } = useStoreActions((state) => state.nodeSummary);

  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer title={t("ui_logs")} />
      <div className="content">
        <div style={{ width: "100%", height: "calc(100vh - 0px)" }}>
          <TextFileComponent content={readUILogs()} />
        </div>
      </div>
    </Suspense>
  );
};
