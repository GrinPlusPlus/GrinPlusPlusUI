import React, { useCallback } from "react";
import { ReceiveUsingFileComponent } from "../../components/transaction/receive/ReceiveUsingFile";
import { Intent, Position, Toaster } from "@blueprintjs/core";
import { useStoreActions } from "../../hooks";
import { useTranslation } from "react-i18next";

export const ReceiveUsingFileContainer = () => {
  const { t } = useTranslation();

  const { updateLogs } = useStoreActions(actions => actions.wallet);
  const { receiveTx } = useStoreActions(actions => actions.receiveCoinsModel);

  const onResponseFilesDropped = useCallback(
    (files: File[]) => {
      receiveTx(files).then((results: [string[], [string, {}][]]) => {
        const errors = results[0];
        if (errors.length === 0) {
          updateLogs(t("finished_without_errors"));
          Toaster.create({ position: Position.BOTTOM }).show({
            message: t("finished_without_errors"),
            intent: Intent.SUCCESS,
            icon: "tick-circle"
          });
        } else {
          errors.forEach(error => {
            updateLogs(t(error));
          });
        }
      });
    },
    [receiveTx, updateLogs, t]
  );

  return (
    <ReceiveUsingFileComponent
      onResponseFilesDroppedCb={onResponseFilesDropped}
    />
  );
};
