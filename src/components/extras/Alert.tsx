import React from "react";
import { Intent, Toast, Toaster } from "@blueprintjs/core";
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
        <Toaster position="bottom">
          <Toast
            icon="tick-circle"
            message={t(message)}
            intent={Intent.SUCCESS}
            onDismiss={() => {
              setMessage(undefined);
            }}
            timeout={5000}
          />
        </Toaster>
      ) : (
        undefined
      )}
    </div>
  );
};
