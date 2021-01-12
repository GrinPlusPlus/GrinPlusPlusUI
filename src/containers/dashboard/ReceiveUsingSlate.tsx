import { ReceiveUsingSlateComponent } from "../../components/transaction/receive/ReceiveUsingSlate";
import {
  Button,
  Classes,
  Dialog,
  Intent,
  Position,
  Toaster,
} from "@blueprintjs/core";
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
      require("electron-log").info("Receiving Slatepack...");
      receiveTxViaSlatepack(slatepack).then(
        (result: { error: string; slatepack: string }) => {
          require("electron-log").info(result);
          if (result.slatepack.trim().length > 0) {
            updateLogs(t("finished_without_errors"));

            Toaster.create({ position: Position.BOTTOM }).show({
              message: t("finished_without_errors"),
              intent: Intent.SUCCESS,
              icon: "tick-circle",
            });

            setReturnedSlatepack(result.slatepack);
          } else {
            Toaster.create({ position: Position.BOTTOM }).show({
              message: result.error,
              intent: Intent.DANGER,
              icon: "warning-sign",
            });
            updateLogs(result.error);
          }
        }
      );
    },
    [receiveTxViaSlatepack, updateLogs, t, setReturnedSlatepack]
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
    [finalizeTxViaSlatepack, updateLogs, t, setSlatepack]
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
      <Dialog
        title="Slatepack"
        icon="label"
        className="bp3-dark"
        isOpen={returnedSlatepack.length !== 0}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>{t("share_to_finalize_transaction")}</p>
          <br />
          <div>
            <SlatepackComponent slatepack={returnedSlatepack} />
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={() => {
                setSlatepack("");
                setReturnedSlatepack("");
              }}
            >
              {t("close")}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
