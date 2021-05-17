import { Classes, Overlay, Spinner, Text } from "@blueprintjs/core";
import React from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { SendUsingAddressComponent } from "../../components/transaction/send/SendUsingAddress";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

export const SendUsingAddressContainer = () => {
  const { t } = useTranslation();
  const { username } = useStoreState((state) => state.session);
  const { amount, inputs } = useStoreState((state) => state.sendCoinsModel);
  const { spendable } = useStoreState((state) => state.walletSummary);

  const { setUsername: setUsernamePrompt } = useStoreActions(
    (state) => state.passwordPrompt
  );

  const { waitingResponse, fee } = useStoreState(
    (state) => state.sendCoinsModel
  );

  const classes = classNames("bp4-dark", Classes.CARD, Classes.ELEVATION_4);

  return (
    <div>
      <SendUsingAddressComponent
        spendable={spendable}
        amount={amount ? Number(amount) : 0}
        inputsSelected={inputs.length !== 0}
        onSendButtonClickedCb={() => {
          setUsernamePrompt(username);
        }}
        fee={fee}
      />
      <Overlay
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isOpen={waitingResponse}
        enforceFocus={true}
        autoFocus={true}
      >
        <div
          className={classes}
          style={{
            top: "50%",
            left: "50%",
            position: "fixed",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spinner size={Spinner.SIZE_SMALL} />
          <Text>{t("sending_wait")}</Text>
        </div>
      </Overlay>
    </div>
  );
};
