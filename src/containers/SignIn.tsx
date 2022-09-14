import React, { Suspense } from "react";

import { HorizontallyCenter } from "../components/styled";
import { LoadingComponent } from "../components/extras/Loading";

const GrinPPBannerComponent = React.lazy(() =>
  import("../components/shared/GrinPPBanner").then((module) => ({
    default: module.GrinPPBannerComponent,
  }))
);

const WalletNavBarContainer = React.lazy(() =>
  import("./common/WalletNavBar").then((module) => ({
    default: module.WalletNavBarContainer,
  }))
);

const OpenWalletContainer = React.lazy(() =>
  import("./wallet/Open").then((module) => ({
    default: module.OpenWalletContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const NodeSettingsDrawer = React.lazy(() =>
  import("./common/NodeSettingsDrawer").then((module) => ({
    default: module.NodeSettingsDrawer,
  }))
);

const P2PSettingsDrawer = React.lazy(() =>
  import("./common/P2PSettingsDrawer").then((module) => ({
    default: module.P2PSettingsDrawer,
  }))
);

const TorSettingsDrawer = React.lazy(() =>
  import("./common/TorSettingsDrawer").then((module) => ({
    default: module.TorSettingsDrawer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const SignInContainer = () => {
  return (
    <Suspense fallback={renderLoader()}>
      <WalletNavBarContainer />
      <div className="content">
        <HorizontallyCenter>
          <br />
          <GrinPPBannerComponent />
          <br />
        </HorizontallyCenter>
        <br />
        <HorizontallyCenter>
          <OpenWalletContainer />
        </HorizontallyCenter>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
      <NodeSettingsDrawer />
      <P2PSettingsDrawer />
      <TorSettingsDrawer />
    </Suspense>
  );
};
