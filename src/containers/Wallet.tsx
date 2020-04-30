import { AlertComponent } from "../components/extras/Alert";
import React, { useEffect, Suspense } from "react";
import { Redirect } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";
import { LoadingComponent } from "../components/extras/Loading";

const AccountNavBarContainer = React.lazy(() =>
  import("./dashboard/AccountNavBar").then((module) => ({
    default: module.AccountNavBarContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const WalletDrawer = React.lazy(() =>
  import("./common/WalletDrawer").then((module) => ({
    default: module.WalletDrawer,
  }))
);

const DashboardContainer = React.lazy(() =>
  import("./dashboard/Dashboard").then((module) => ({
    default: module.DashboardContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const WalletContainer = () => {
  const { token, address, isLoggedIn } = useStoreState(
    (state) => state.session
  );
  const { retryInterval } = useStoreState(
    (actions) => actions.receiveCoinsModel
  );
  const { updateSummaryInterval } = useStoreState(
    (state) => state.walletSummary
  );
  const { alert } = useStoreState((state) => state.ui);

  const { setAlert } = useStoreActions((actions) => actions.ui);
  const { getWalletSummary } = useStoreActions(
    (actions) => actions.walletSummary
  );
  const { getAddress } = useStoreActions(
    (actions) => actions.receiveCoinsModel
  );

  useEffect(() => {
    async function init(t: string) {
      await getWalletSummary(t);
    }
    init(token);
    const interval = setInterval(async () => {
      await getWalletSummary(token);
    }, updateSummaryInterval);

    return () => clearInterval(interval);
  }, [getWalletSummary, token, updateSummaryInterval]);

  useEffect(() => {
    async function init(t: string) {
      await getAddress(t);
    }
    if (address.length !== 56) {
      init(token);
      const interval = setInterval(async () => {
        await getAddress(token);
      }, retryInterval);
      return () => clearInterval(interval);
    }
  }, [address, getAddress, token, retryInterval]);

  return (
    <Suspense fallback={renderLoader()}>
      {!isLoggedIn ? <Redirect to="/login" /> : null}
      <AccountNavBarContainer />
      <div className="content">
        <DashboardContainer />
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
      <WalletDrawer />
      <AlertComponent message={alert} setMessage={setAlert} />
    </Suspense>
  );
};
