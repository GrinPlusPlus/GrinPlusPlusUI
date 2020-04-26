import React from 'react';
import TransactionMessageComponent from '../../components/transaction/send/TransactionMessage';
import { useStoreActions, useStoreState } from '../../hooks';

export default function TransactionMessageContainer() {
  const { message } = useStoreState((state) => state.sendCoinsModel);
  const { setMessage } = useStoreActions((actions) => actions.sendCoinsModel);

  return (
    <TransactionMessageComponent message={message} setMessageCb={setMessage} />
  );
}
