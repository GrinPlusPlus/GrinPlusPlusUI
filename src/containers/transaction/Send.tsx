import React, { useEffect, Suspense } from "react";
import { useStoreActions, useStoreState } from "../../hooks";
import {
  Left,
  SendGrinsContent,
  SendGrinTopRow,
} from "../../components/styled";
import { LoadingComponent } from "../../components/extras/Loading";

const SpendableContainer = React.lazy(() =>
  import("./Spendable").then((module) => ({
    default: module.SpendableContainer,
  }))
);

const TransactionAmountContainer = React.lazy(() =>
  import("./TransactionAmount").then((module) => ({
    default: module.TransactionAmountContainer,
  }))
);

const SaveTransactionFileContainer = React.lazy(() =>
  import("./SaveTransactionFile").then((module) => ({
    default: module.SaveTransactionFileContainer,
  }))
);

const TransactionMessageContainer = React.lazy(() =>
  import("./TransactionMessage").then((module) => ({
    default: module.TransactionMessageContainer,
  }))
);

const TransactionAddressContainer = React.lazy(() =>
  import("./TransactionAddress").then((module) => ({
    default: module.TransactionAddressContainer,
  }))
);

const CoinControlContainer = React.lazy(() =>
  import("./CoinControl").then((module) => ({
    default: module.CoinControlContainer,
  }))
);

const renderLoader = () => <LoadingComponent />;

export const SendContainer = () => {
  const { token } = useStoreState((state) => state.session);

  const { getOutputs, setInitialValues } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  useEffect(() => {
    setInitialValues();
    async function init(t: string) {
      await getOutputs(t).catch(() => {});
    }
    init(token);
  }, [getOutputs, token, setInitialValues]);

  return (
    <Suspense fallback={renderLoader()}>
      <SendGrinsContent>
        <div style={{ float: "right", marginTop: "10px" }}>
          <SpendableContainer />
        </div>
        <SendGrinTopRow>
          <Left>
            <TransactionAmountContainer />
          </Left>
          <div style={{ textAlign: "right", paddingRight: "5px" }}>
            <SaveTransactionFileContainer />
          </div>
        </SendGrinTopRow>
        <TransactionMessageContainer />
        <TransactionAddressContainer />
        <CoinControlContainer />
      </SendGrinsContent>
    </Suspense>
  );
};
