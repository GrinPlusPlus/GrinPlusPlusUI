import { ReceiveUsingSlateComponent } from "../../components/transaction/receive/ReceiveUsingSlate";
import React from "react";
import { useStoreState } from "../../hooks";

export const ReceiveUsingSlateContainer = () => {
  const { slate } = useStoreState((actions) => actions.receiveCoinsModel);

  return <ReceiveUsingSlateComponent slate={slate} />;
};
