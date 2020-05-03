import { FinalizeComponent } from "../../components/transaction/finalize/FinalizeGrins";
import React, { useCallback } from "react";
import { Intent, Position, Toaster } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";

export const FinalizeContainer = () => {
  const { responseFile } = useStoreState((state) => state.finalizeModel);
  const { useGrinJoin, grinJoinAddress } = useStoreState(
    (state) => state.settings
  );

  const { finalizeTx, setResponseFile } = useStoreActions(
    (actions) => actions.finalizeModel
  );

  const setFileToFinalize = useCallback(
    (file: File) => {
      setResponseFile(file);
    },
    [setResponseFile]
  );

  const onFinalizeButtonClicked = useCallback(() => {
    if (!responseFile) return;
    finalizeTx({
      file: responseFile,
      method: useGrinJoin ? "JOIN" : "STEM",
      grinJoinAddress: grinJoinAddress,
    }).then((message: string) => {
      Toaster.create({ position: Position.BOTTOM }).show({
        message: message,
        intent: message.includes("FINALZED") ? Intent.SUCCESS : Intent.DANGER,
        icon: message.includes("FINALZED") ? "tick-circle" : "warning-sign",
      });
    });
  }, [finalizeTx, responseFile, useGrinJoin, grinJoinAddress]);

  return (
    <FinalizeComponent
      responseFile={responseFile}
      setFileToFinalizeCb={setFileToFinalize}
      onFinalizeButtonClickedCb={onFinalizeButtonClicked}
    />
  );
};
