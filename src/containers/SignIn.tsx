import React, { useEffect, Suspense } from "react";
import { HorizontallyCenter } from "../components/styled";
import { useStoreActions } from "../hooks";
import { useHistory } from "react-router-dom";
import { WalletDrawer } from "./common/WalletDrawer";
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

const renderLoader = () => <LoadingComponent />;

export default function SignInContainer() {
  let history = useHistory();

  const { checkNodeHealth } = useStoreActions((actions) => actions.wallet);
  useEffect(() => {
    try {
      checkNodeHealth();
    } catch (error) {
      history.push("/error");
    }
  });

  return (
    <Suspense fallback={renderLoader()}>
      <div>
        <WalletNavBarContainer />
        <div className="content">
          <HorizontallyCenter>
            <GrinPPBannerComponent />
          </HorizontallyCenter>
          <br />
          <HorizontallyCenter>
            <OpenWalletContainer />
          </HorizontallyCenter>
        </div>
        <div className="footer">
          <StatusBarContainer />
        </div>
        <WalletDrawer />
      </div>
    </Suspense>
  );
}
