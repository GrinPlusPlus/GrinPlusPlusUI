import { Intent, Toast, OverlayToaster } from "@blueprintjs/core";

import React from "react";
import { useTranslation } from "react-i18next";

export type AlertProps = {
  message: string | undefined;
  setMessage: (message: string | undefined) => void;
};

export const AlertComponent = ({ message, setMessage }: AlertProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {message ? (
        <OverlayToaster position="bottom">
          <Toast
            icon="tick-circle"
            message={t(message)}
            intent={Intent.SUCCESS}
            onDismiss={() => {
              setMessage(undefined);
            }}
            timeout={5000}
          />
        </OverlayToaster>
      ) : undefined}
    </div>
  );
};
