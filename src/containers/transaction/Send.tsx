import CoinControlContainer from './CoinControlContainer';
import React, { useEffect } from 'react';
import SaveTransactionFile from './SaveTransactionFile';
import Spendable from './Spendable';
import TransactionAddress from './TransactionAddress';
import TransactionAmount from './TransactionAmount';
import TransactionMessage from './TransactionMessage';
import { useStoreActions, useStoreState } from '../../hooks';
import {
  Left,
  SendGrinsContent,
  SendGrinTopRow,
} from "../../components/styled";

export default function SendContainer() {
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
    <SendGrinsContent>
      <div style={{ float: "right", marginTop: "10px" }}>
        <Spendable />
      </div>
      <SendGrinTopRow>
        <Left>
          <TransactionAmount />
        </Left>
        <div style={{ textAlign: "right", paddingRight: "5px" }}>
          <SaveTransactionFile />
        </div>
      </SendGrinTopRow>
      <TransactionMessage />
      <TransactionAddress />
      <CoinControlContainer />
    </SendGrinsContent>
  );
}
