import { useStoreActions, useStoreState } from "../../hooks";

import React from "react";
import { TransactionMessageComponent } from "../../components/transaction/send/TransactionMessage";

export const TransactionMessageContainer = () => {
  const { message } = useStoreState(state => state.sendCoinsModel);
  const { setMessage } = useStoreActions(actions => actions.sendCoinsModel);

  return (
    <TransactionMessageComponent message={message} setMessageCb={setMessage} />
  );
};
