import { ReceiveUsingSlateComponent } from "../../components/transaction/receive/ReceiveUsingSlate";
import { Alert, Intent, Position, Toaster } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";
import { Title } from "../../components/styled";
import { SlatepackComponent } from "../../components/extras/Slatepack";

export const ReceiveUsingSlateContainer = () => {
  const { t } = useTranslation();

  const { slatepack, returnedSlatepack } = useStoreState(
    (actions) => actions.receiveCoinsModel
  );
  const { updateLogs } = useStoreActions((actions) => actions.wallet);
  const {
    setSlatepack,
    receiveTxViaSlatepack,
    setReturnedSlatepack,
  } = useStoreActions((actions) => actions.receiveCoinsModel);
  const { finalizeTxViaSlatepack } = useStoreActions(
    (actions) => actions.finalizeModel
  );

  const onReceiveSlatepack = useCallback(
    (slatepack: string) => {
      receiveTxViaSlatepack(slatepack).then(
        (result: { error: string; slatepack: string }) => {
          if (result.error.length === 0) {
            updateLogs(t("finished_without_errors"));
            Toaster.create({ position: Position.BOTTOM }).show({
              message: t("finished_without_errors"),
              intent: Intent.SUCCESS,
              icon: "tick-circle",
            });

            setReturnedSlatepack(result.slatepack);
          } else {
            updateLogs(t(result.error));
          }
        }
      );
    },
    [receiveTxViaSlatepack, updateLogs, t]
  );

  const onFinalizeSlatepack = useCallback(
    (slatepack: string) => {
      finalizeTxViaSlatepack(slatepack).then((result: { error: string }) => {
        if (result.error == null) {
          updateLogs(t("finished_without_errors"));
          Toaster.create({ position: Position.BOTTOM }).show({
            message: t("finished_without_errors"),
            intent: Intent.SUCCESS,
            icon: "tick-circle",
          });

          setSlatepack("");
        } else {
          updateLogs(t(result.error));
        }
      });
    },
    [finalizeTxViaSlatepack, updateLogs, t]
  );

  return (
    <div>
      <Title>{t("slatepack")}</Title>
      <div style={{ marginTop: "10px" }}>
        <ReceiveUsingSlateComponent
          slate={slatepack}
          onReceiveSlatepackCb={onReceiveSlatepack}
          setSlatepackTextCb={setSlatepack}
          onFinalizeSlatepackCb={onFinalizeSlatepack}
        />
      </div>
      <Alert
        className="bp3-dark"
        confirmButtonText="Copy & Continue"
        canEscapeKeyCancel={false}
        canOutsideClickCancel={false}
        isOpen={returnedSlatepack.length !== 0}
        onClose={() => {
          navigator.clipboard.writeText(returnedSlatepack);
          setSlatepack("");
          setReturnedSlatepack("");
        }}
      >
        <SlatepackComponent slatepack={returnedSlatepack} />
      </Alert>
    </div>
  );
};
