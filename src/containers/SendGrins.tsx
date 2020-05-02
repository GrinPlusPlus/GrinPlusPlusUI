import React, { Suspense, useEffect } from "react";
import { LoadingComponent } from "../components/extras/Loading";
import { Redirect } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks";

const NavBarContainer = React.lazy(() =>
  import("./common/NavigationBar").then((module) => ({
    default: module.NavigationBarContainer,
  }))
);

const SendContainer = React.lazy(() =>
  import("./transaction/Send").then((module) => ({
    default: module.SendContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const SendGrinContainer = () => {
  const { token, isLoggedIn } = useStoreState((state) => state.session);
  const { updateSummaryInterval } = useStoreState(
    (state) => state.walletSummary
  );

  const { updateWalletSummary } = useStoreActions(
    (actions) => actions.walletSummary
  );
  const { setInitialValues } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  async function getSummary(t: string) {
    try {
      await updateWalletSummary(t);
    } catch (error) {
      require("electron-log").error(
        `Error trying to get Wallet Summary: ${error.message}`
      );
    }
  }

  useEffect(() => {
    let timer = setTimeout(() => getSummary(token), updateSummaryInterval);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <Suspense fallback={renderLoader()}>
      {!isLoggedIn ? <Redirect to="/login" /> : null}
      <NavBarContainer
        title={"Send Grins ツ"}
        onExit={() => setInitialValues()}
      />
      <div className="content">
        <SendContainer />
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
