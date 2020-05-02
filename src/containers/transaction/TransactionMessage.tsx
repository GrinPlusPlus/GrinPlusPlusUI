import React from "react";
import { TransactionMessageComponent } from "../../components/transaction/send/TransactionMessage";
import { useStoreActions, useStoreState } from "../../hooks";

export const TransactionMessageContainer = () => {
  const { message } = useStoreState((state) => state.sendCoinsModel);
  const { setMessage } = useStoreActions((actions) => actions.sendCoinsModel);

  return (
    <TransactionMessageComponent message={message} setMessageCb={setMessage} />
  );
};
