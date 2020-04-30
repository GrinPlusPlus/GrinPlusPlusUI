import classNames from "classnames";
import React, { useCallback } from "react";
import { SendUsingAddressComponent } from "../../components/transaction/send/SendUsingAddress";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../hooks";
import {
  Intent,
  Position,
  Toaster,
  Classes,
  Overlay,
  Spinner,
  Text,
} from "@blueprintjs/core";

export const SendUsingAddressContainer = () => {
  let history = useHistory();

  const { spendable } = useStoreState((state) => state.walletSummary);
  const {
    amount,
    message,
    strategy,
    inputs,
    address,
    waitingResponse,
    isAddressValid,
  } = useStoreState((state) => state.sendCoinsModel);
  const { token } = useStoreState((state) => state.session);
  const { sendUsingListener, setWaitingResponse } = useStoreActions(
    (actions) => actions.sendCoinsModel
  );

  const { useGrinJoin, grinJoinAddress } = useStoreState(
    (state) => state.settings
  );

  const onSendButtonClicked = useCallback(async () => {
    if (amount === undefined || amount.slice(-1) === ".") return;

    setWaitingResponse(true);

    const sent: boolean | string = await sendUsingListener({
      amount: Number(amount),
      message: message,
      address: address,
      method: useGrinJoin ? "JOIN" : "STEM",
      grinJoinAddress: grinJoinAddress,
      inputs: inputs,
      token: token,
      strategy: strategy,
    });

    const v3 = "[a-z2-7]{56}";
    const alert = new RegExp(`${v3}`).test(address)
      ? "Transaction sent successfully"
      : "Transaction started successfully";

    Toaster.create({ position: Position.TOP }).show({
      message: sent === true ? alert : sent,
      intent: sent === true ? Intent.SUCCESS : Intent.DANGER,
      icon: sent === true ? "tick-circle" : "warning-sign",
    });

    if (sent === true) history.push("/wallet");
  }, [
    sendUsingListener,
    amount,
    message,
    address,
    inputs,
    token,
    useGrinJoin,
    grinJoinAddress,
    strategy,
    history,
    setWaitingResponse,
  ]);

  const classes = classNames("bp3-dark", Classes.CARD, Classes.ELEVATION_4);

  return (
    <div>
      <SendUsingAddressComponent
        spendable={spendable}
        amount={amount ? Number(amount) : 0}
        inputsSelected={inputs.length !== 0}
        isAddressValid={isAddressValid}
        onSendButtonClickedCb={onSendButtonClicked}
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
          <Text>Sending, please wait..</Text>
        </div>
      </Overlay>
    </div>
  );
};
