import React from "react";
import { Intent, Toast, Toaster } from "@blueprintjs/core";

export type AlertProps = {
  message: string | undefined;
  setMessage: (message: string | undefined) => void;
};

export const AlertComponent = ({ message, setMessage }: AlertProps) => {
  return (
    <div>
      {message ? (
        <Toaster position="bottom">
          <Toast
            icon="tick-circle"
            message={message}
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
