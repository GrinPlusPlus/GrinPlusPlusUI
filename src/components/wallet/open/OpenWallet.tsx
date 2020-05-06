import classNames from "classnames";
import { InputPasswordComponent } from "../../../components/custom/InputPassword";
import React from "react";
import { AccountListContent } from "../../styled";
import {
  Button,
  Classes,
  Intent,
  Overlay,
  Text,
  Spinner,
} from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

type OpenWalletProps = {
  username: string;
  password: string;
  accounts: JSX.Element[];
  passwordCb: (password: string) => void;
  overlayCb: () => void;
  loginButtonCb: () => void;
  waitingResponse: boolean;
  connected: boolean;
};

export const OpenWalletComponent = ({
  username,
  password,
  accounts,
  passwordCb,
  overlayCb,
  loginButtonCb,
  waitingResponse,
  connected,
}: OpenWalletProps) => {
  const { t } = useTranslation();
  const classes = classNames("bp3-dark", Classes.CARD, Classes.ELEVATION_4);

  return (
    <div>
      <Overlay
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        isOpen={username?.length > 0}
        enforceFocus={true}
        autoFocus={true}
        onClose={overlayCb}
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
              {t(`${"password_for"}.1`)}: <b>{username}</b>
            </Text>
          </div>
          <div style={{ width: "400px" }}>
            <InputPasswordComponent
              password={password}
              cb={passwordCb}
              onEnterCb={loginButtonCb}
              autoFocus={true}
              waitingResponse={waitingResponse}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              data-testid="open-wallet-button"
              intent={Intent.PRIMARY}
              style={{ color: "black", marginTop: "10px" }}
              text={
                waitingResponse ? (
                  <Spinner size={Spinner.SIZE_SMALL} />
                ) : (
                    t(`${"open_wallet"}.1`)
                  )
              }
              onClick={loginButtonCb}
              disabled={password?.length === 0 || waitingResponse || !connected}
            />
          </div>
        </div>
      </Overlay>
      <AccountListContent>{accounts}</AccountListContent>
    </div>
  );
};
