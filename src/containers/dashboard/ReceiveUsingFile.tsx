import React, { useCallback } from "react";
import { ReceiveUsingFileComponent } from "../../components/transaction/receive/ReceiveUsingFile";
import { Intent, Position, Toaster } from "@blueprintjs/core";
import { useStoreActions } from "../../hooks";

export const ReceiveUsingFileContainer = () => {
  const { updateLogs } = useStoreActions((actions) => actions.wallet);
  const { receiveTx } = useStoreActions((actions) => actions.receiveCoinsModel);

  const onResponseFilesDropped = useCallback(
    (files: File[]) => {
      receiveTx(files).then((results: [string[], [string, {}][]]) => {
        const errors = results[0];
        if (errors.length === 0) {
          Toaster.create({ position: Position.TOP }).show({
            message: "Finished without warnings and/or errors",
            intent: Intent.SUCCESS,
            icon: "tick-circle",
          });
        } else {
          errors.forEach((error) => {
            updateLogs(error);
          });
        }
      });
    },
    [receiveTx, updateLogs]
  );

  return (
    <ReceiveUsingFileComponent
      onResponseFilesDroppedCb={onResponseFilesDropped}
    />
  );
};
