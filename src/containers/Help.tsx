import React, { Suspense } from "react";

import { HorizontallyCenter } from "../components/styled";
import { LoadingComponent } from "../components/extras/Loading";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../hooks";

const NavigationBarContainer = React.lazy(() =>
  import("./common/NavigationBar").then((module) => ({
    default: module.NavigationBarContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const HelpContainer = () => {
  const { t } = useTranslation();

  const { language } = useStoreState((actions) => actions.idiom);

  const HelpComponent = React.lazy(() =>
    import(`../components/extras/help/Help.${language}.tsx`).then((module) => ({
      default: module.HelpComponent,
    }))
  );

  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer title={t("help")} />
      <div className="content">
        <HorizontallyCenter>
          <HelpComponent />
        </HorizontallyCenter>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
