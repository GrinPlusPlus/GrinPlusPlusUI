import React, { Suspense } from "react";
import { HorizontallyCenter } from "../components/styled";
import { LoadingComponent } from "../components/extras/Loading";

const LogoComponent = React.lazy(() =>
  import("../components/shared/Logo").then((module) => ({
    default: module.LogoComponent,
  }))
);

const NavigationBarContainer = React.lazy(() =>
  import("./common/NavigationBar").then((module) => ({
    default: module.NavigationBarContainer,
  }))
);

const NodeCheckContainer = React.lazy(() =>
  import("./node/Check").then((module) => ({
    default: module.NodeCheckContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const StatusContainer = () => {
  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer title="Connected Peers" />
      <div className="content">
        <HorizontallyCenter>
          <LogoComponent />
        </HorizontallyCenter>
        <HorizontallyCenter>
          <NodeCheckContainer />
        </HorizontallyCenter>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
