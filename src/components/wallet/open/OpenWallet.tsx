import { AccountListContent } from "../../styled";
import { PasswordPromptComponent } from "./PasswordPrompt";
import React from "react";
import { useTranslation } from "react-i18next";

type OpenWalletProps = {
  action: "open_wallet" | "delete_wallet" | undefined;
  username: string;
  password: string;
  accounts: JSX.Element[];
  passwordCb: (password: string) => void;
  onCloseCb: () => void;
  passwordButtonCb: () => Promise<void>;
  waitingResponse: boolean;
  connected: boolean;
};

export const OpenWalletComponent = ({
  action,
  username,
  password,
  accounts,
  passwordCb,
  onCloseCb,
  passwordButtonCb,
  waitingResponse,
  connected,
}: OpenWalletProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <PasswordPromptComponent
        isOpen={username?.length > 0}
        username={username}
        password={password}
        passwordCb={passwordCb}
        onCloseCb={onCloseCb}
        waitingResponse={waitingResponse}
        passwordButtonCb={passwordButtonCb}
        connected={connected}
        buttonText={
          action === "open_wallet" ? t("open_wallet") : t("delete_wallet")
        }
      />
      <AccountListContent>{accounts}</AccountListContent>
    </div>
  );
};
