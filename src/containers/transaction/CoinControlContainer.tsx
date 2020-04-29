import CoinControlComponent from '../../components/transaction/send/CoinControl';
import React, { useCallback } from 'react';
import { useStoreActions, useStoreState } from '../../hooks';

export default function CoinControlContainer() {
  const { strategy, inputsTable, inputs } = useStoreState(
    (state) => state.sendCoinsModel
  );

  const { setStrategy, addCustomInput, removeCustomInput } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  const updateInputs = useCallback(
    (commitment: string) => {
      if (!inputs.includes(commitment)) {
        addCustomInput(commitment);
      } else {
        removeCustomInput(commitment);
      }
    },
    [addCustomInput, removeCustomInput, inputs]
  );

  return (
    <CoinControlComponent
      strategy={strategy}
      inputsTable={inputsTable}
      setStrategyCb={(s: string) => {
        setStrategy(s);
      }}
      updateInputsCb={(c: string) => {
        updateInputs(c);
      }}
      inputs={inputs}
    />
  );
}