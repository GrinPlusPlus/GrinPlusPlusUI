import { Form, HorizontallyCenter } from "../components/styled";
import React, { Suspense } from "react";

import { Button } from "@blueprintjs/core";
import { LoadingComponent } from "../components/extras/Loading";
import { useNavigate } from "react-router-dom";
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

const CreateWalletContainer = React.lazy(() =>
  import("./wallet/Create").then((module) => ({
    default: module.CreateWalletContainer,
  }))
);

const StatusBarContainer = React.lazy(() =>
  import("./common/StatusBar").then((module) => ({
    default: module.StatusBarContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const SignUpContainer = () => {
  const { t } = useTranslation();

  const { setInitialValues } = useStoreActions(
    (actions) => actions.createWallet
  );

  const navigate = useNavigate();

  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer
        title={t("create_wallet")}
        onExit={() => setInitialValues()}
      />
      <div className="content">
        <HorizontallyCenter>
          <LogoComponent />
        </HorizontallyCenter>
        <Form>
          <CreateWalletContainer />
        </Form>
        <HorizontallyCenter>
          <Button
            minimal={true}
            style={{ width: "200px" }}
            text={t("cancel")}
            onClick={() => {
              setInitialValues();
              navigate("/login");
            }}
          />
        </HorizontallyCenter>
      </div>
      <div className="footer">
        <StatusBarContainer />
      </div>
    </Suspense>
  );
};
