import { ReceiveUsingSlateComponent } from "../../components/transaction/receive/ReceiveUsingSlate";
import { Intent, Position, Toaster } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

export const ReceiveUsingSlateContainer = () => {
  const { t } = useTranslation();

  const { slatepack } = useStoreState((actions) => actions.receiveCoinsModel);
  const { updateLogs } = useStoreActions(actions => actions.wallet);
  const { setSlatepack, receiveTxViaSlatepack } = useStoreActions(actions => actions.receiveCoinsModel);


  const onReceiveSlatepack = useCallback(
    (slatepack: string) => {
      receiveTxViaSlatepack(slatepack).then((result: { error: string; slatepack: string; }) => {
        if (result.error.length === 0) {
          updateLogs(t("finished_without_errors"));
          Toaster.create({ position: Position.BOTTOM }).show({
            message: t("finished_without_errors"),
            intent: Intent.SUCCESS,
            icon: "tick-circle"
          });

          setSlatepack(result.slatepack);
        } else {
          updateLogs(t(result.error));
        }
      });
    },
    [receiveTxViaSlatepack, updateLogs, t]
  );

  return <ReceiveUsingSlateComponent
    slate={slatepack}
    onReceiveSlatepackCb={onReceiveSlatepack}
    setSlatepackTextCb={setSlatepack}
  />;
};
