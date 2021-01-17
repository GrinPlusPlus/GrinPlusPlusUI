import React, { Suspense } from "react";
import { useStoreActions, useStoreState } from "../hooks";

import { LoadingComponent } from "../components/extras/Loading";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NavBarContainer = React.lazy(() =>
  import("./common/NavigationBar").then((module) => ({
    default: module.NavigationBarContainer,
  }))
);

const ReceiveContainer = React.lazy(() =>
  import("./transaction/Receive").then((module) => ({
    default: module.ReceiveContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const ReceiveGrinContainer = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useStoreState((state) => state.session);
  const { setSlatepack, setReturnedSlatepack } = useStoreActions(
    (actions) => actions.receiveCoinsModel
  );

  return (
    <Suspense fallback={renderLoader()}>
      {!isLoggedIn ? <Redirect to="/login" /> : null}
      <NavBarContainer
        title={`${t("receive_grins")}`}
        onExit={() => {
          setSlatepack("");
          setReturnedSlatepack("");
        }}
      />
      <div className="content">
        <ReceiveContainer />
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
