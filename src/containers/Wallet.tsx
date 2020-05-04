import React, { Suspense } from 'react';
import { AlertComponent } from '../components/extras/Alert';
import { LoadingComponent } from '../components/extras/Loading';
import { Redirect } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../hooks';

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
  const { isLoggedIn } = useStoreState(
    (state) => state.session
  );
  const { alert } = useStoreState((state) => state.ui);
  const { setAlert } = useStoreActions((actions) => actions.ui);

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
