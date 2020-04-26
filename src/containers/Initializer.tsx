import InitComponent from '../components/extras/Init';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../hooks';

export default function InitializerContainer() {
  let history = useHistory();
  const { message, initializingError, isWalletInitialized } = useStoreState(
    (state) => state.wallet
  );
  const { accounts } = useStoreState((state) => state.signinModel);

  const { initializeWallet } = useStoreActions((state) => state.wallet);
  const { getAccounts } = useStoreActions((actions) => actions.signinModel);

  useEffect(() => {
    if (!isWalletInitialized) initializeWallet();
    const interval = setInterval(async () => {
      await getAccounts();
      if (accounts !== undefined) {
        setInterval(history.push("/login"));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isWalletInitialized, initializeWallet, history, accounts, getAccounts]);

  return (
    <InitComponent
      isInitialized={accounts !== undefined}
      error={initializingError}
      message={message}
    />
  );
}
