import React, { Suspense } from "react";
import { useStoreActions, useStoreState } from "../hooks";

import { LoadingComponent } from "../components/extras/Loading";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { isLoggedIn } = useStoreState((state) => state.session);
  const { setInitialValues } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  return (
    <Suspense fallback={renderLoader()}>
      {!isLoggedIn ? <Navigate replace to="/login" /> : null}
      <NavBarContainer
        title={`${t("send_grins")}`}
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
