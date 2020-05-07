import { FinalizeComponent } from "../../components/transaction/finalize/FinalizeGrins";
import React, { useCallback } from "react";
import { Intent, Position, Toaster } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

export const FinalizeContainer = () => {
  const { t } = useTranslation();

  const { responseFile } = useStoreState((state) => state.finalizeModel);
  const { useGrinJoin, grinJoinAddress } = useStoreState(
    (state) => state.settings
  );

  const { finalizeTx, setResponseFile } = useStoreActions(
    (actions) => actions.finalizeModel
  );

  const { updateLogs } = useStoreActions((actions) => actions.wallet);

  const setFileToFinalize = useCallback(
    (file: File) => {
      setResponseFile(file);
    },
    [setResponseFile]
  );

  const onFinalizeButtonClicked = useCallback(() => {
    if (!responseFile) return;
    updateLogs(t("trying_to_finalize"));

    finalizeTx({
      file: responseFile,
      method: useGrinJoin ? "JOIN" : "STEM",
      grinJoinAddress: grinJoinAddress,
    }).then((message: string) => {
      Toaster.create({ position: Position.BOTTOM }).show({
        message: message,
        intent: message === "finalized" ? Intent.SUCCESS : Intent.DANGER,
        icon: message === "finalized" ? "tick-circle" : "warning-sign",
      });
      updateLogs(t(message));
    });
  }, [finalizeTx, responseFile, useGrinJoin, grinJoinAddress, updateLogs, t]);

  return (
    <FinalizeComponent
      responseFile={responseFile}
      setFileToFinalizeCb={setFileToFinalize}
      onFinalizeButtonClickedCb={onFinalizeButtonClicked}
    />
  );
};
