import { Intent, Position, Toaster } from "@blueprintjs/core";
import React, { useCallback } from "react";

import { ReceiveUsingFileComponent } from "../../components/transaction/receive/ReceiveUsingFile";
import { useStoreActions } from "../../hooks";
import { useTranslation } from "react-i18next";
import { Title } from "../../components/styled";

export const ReceiveUsingFileContainer = () => {
  const { t } = useTranslation();

  const { updateLogs } = useStoreActions((actions) => actions.wallet);
  const { receiveTx } = useStoreActions((actions) => actions.receiveCoinsModel);

  const onResponseFilesDropped = useCallback(
    (files: File[]) => {
      receiveTx(files).then(
        (results: {
          errors: string[];
          slatepacks: {
            filename: string;
            slatepack: string;
          }[];
        }) => {
          const errors = results.errors;
          if (errors.length === 0) {
            updateLogs(t("finished_without_errors"));
            Toaster.create({ position: Position.BOTTOM }).show({
              message: t("finished_without_errors"),
              intent: Intent.SUCCESS,
              icon: "tick-circle",
            });
          } else {
            errors.forEach((error) => {
              updateLogs(t(error));
            });
          }
        }
      );
    },
    [receiveTx, updateLogs, t]
  );

  return (
    <div>
      <Title>{t("receive")}</Title>
      <ReceiveUsingFileComponent
        onResponseFilesDroppedCb={onResponseFilesDropped}
      />
    </div>
  );
};
