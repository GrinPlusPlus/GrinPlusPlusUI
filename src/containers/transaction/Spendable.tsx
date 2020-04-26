import React from 'react';
import SpendableComponent from '../../components/transaction/send/SpendableComponent';
import { useStoreState } from '../../hooks';

export default function SpendableContainer() {
  const { spendable } = useStoreState((state) => state.walletSummary);

  return <SpendableComponent spendable={spendable} />;
}
