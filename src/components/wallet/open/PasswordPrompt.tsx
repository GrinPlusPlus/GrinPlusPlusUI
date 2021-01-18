import {
  Button,
  Classes,
  Intent,
  Overlay,
  Spinner,
  Text,
} from "@blueprintjs/core";

import { InputPasswordComponent } from "../../custom/InputPassword";
import React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Flex, HorizontallyCenter } from "../../styled";

type PasswordPromptProps = {
  username: string;
  password: string;
  passwordCb: (password: string) => void;
  onCloseCb: () => void;
  passwordButtonCb?: () => Promise<void>;
  deleteWalletButtonCb?: () => Promise<void>;
  waitingResponse: boolean;
  connected: boolean;
  buttonText: string;
  isOpen: boolean;
};

export const PasswordPromptComponent = ({
  username,
  password,
  passwordCb,
  onCloseCb,
  passwordButtonCb,
  deleteWalletButtonCb,
  waitingResponse,
  connected,
  buttonText,
  isOpen,
}: PasswordPromptProps) => {
  const { t } = useTranslation();
  const classes = classNames("bp3-dark", Classes.CARD, Classes.ELEVATION_4);

  return (
    <Overlay
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      isOpen={isOpen}
      enforceFocus={true}
      autoFocus={true}
      onClose={onCloseCb}
    >
      <div
        className={classes}
        style={{
          top: "50%",
          left: "50%",
          position: "fixed",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#060707",
        }}
      >
        <div style={{ marginBottom: "8px", fontSize: "14px" }}>
          <Text>
            {t("password_for")}: <b>{username}</b>
          </Text>
        </div>
        <div style={{ width: "400px" }}>
          <InputPasswordComponent
            password={password}
            cb={passwordCb}
            onEnterCb={passwordButtonCb}
            autoFocus={true}
            waitingResponse={waitingResponse}
          />
        </div>
        <HorizontallyCenter>
          <Flex>
            <Button
              data-testid="open-wallet-button"
              intent={Intent.PRIMARY}
              style={{ color: "black", marginTop: "10px" }}
              text={
                waitingResponse ? (
                  <Spinner size={Spinner.SIZE_SMALL} />
                ) : (
                  buttonText
                )
              }
              onClick={passwordButtonCb}
              disabled={password?.length === 0 || waitingResponse || !connected}
            />
            {deleteWalletButtonCb !== undefined ? (
              <Button
                style={{
                  marginLeft: "5px",
                  marginTop: "10px",
                }}
                text={t("delete_wallet")}
                intent={Intent.DANGER}
                onClick={() => deleteWalletButtonCb()}
                disabled={
                  password?.length === 0 || waitingResponse || !connected
                }
              />
            ) : null}
          </Flex>
        </HorizontallyCenter>
      </div>
    </Overlay>
  );
};
