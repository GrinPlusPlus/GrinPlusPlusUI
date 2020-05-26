import { Form, HorizontallyCenter } from "../components/styled";
import React, { Suspense } from "react";

import { Button } from "@blueprintjs/core";
import { LoadingComponent } from "../components/extras/Loading";
import { useHistory } from "react-router-dom";
import { useStoreActions } from "../hooks";
import { useTranslation } from "react-i18next";

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

const RestoreWalletContainer = React.lazy(() =>
  import("./wallet/Restore").then((module) => ({
    default: module.RestoreWalletContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const RestoreContainer = () => {
  const { t } = useTranslation();

  const { setInitialValues } = useStoreActions(
    (actions) => actions.restoreWallet
  );

  let history = useHistory();

  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer
        title={t("restore_wallet")}
        onExit={() => setInitialValues()}
      />
      <div className="content">
        <HorizontallyCenter>
          <LogoComponent />
        </HorizontallyCenter>
        <Form>
          <RestoreWalletContainer />
        </Form>
        <HorizontallyCenter>
          <Button
            minimal={true}
            style={{ width: "200px" }}
            text={t("cancel")}
            onClick={() => history.push("/login")}
          />
        </HorizontallyCenter>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
