import React, { useState } from "react";
import { Button, InputGroup, Intent } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

export type InputPasswordProps = {
  password: string;
  cb: (password: string) => void;
  autoFocus: boolean;
  onEnterCb?: () => void;
  waitingResponse?: boolean;
};

export const InputPasswordComponent = ({
  password,
  cb,
  autoFocus,
  onEnterCb,
  waitingResponse,
}: InputPasswordProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup
      data-testid="password-field"
      className="bp3-dark"
      style={{ backgroundColor: "#21242D" }}
      type={showPassword ? "text" : "password"}
      value={password}
      placeholder={t("password")}
      autoFocus={autoFocus}
      disabled={waitingResponse}
      rightElement={
        <Button
          icon={showPassword ? "eye-open" : "eye-off"}
          intent={Intent.WARNING}
          minimal={true}
          large={false}
          onClick={() => setShowPassword(!showPassword)}
        />
      }
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (onEnterCb && e.keyCode === 13) onEnterCb();
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => cb(e.target.value)}
    />
  );
};
