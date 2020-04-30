import React, { Suspense } from "react";
import { Form, HorizontallyCenter } from "../components/styled";
import { LoadingComponent } from "../components/extras/Loading";
import { useHistory } from "react-router-dom";
import { Button } from "@blueprintjs/core";

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
  let history = useHistory();
  return (
    <Suspense fallback={renderLoader()}>
      <NavigationBarContainer title="Restore Wallet" />
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
            text="Cancel"
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
