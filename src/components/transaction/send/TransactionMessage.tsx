import { FormGroup, InputGroup } from "@blueprintjs/core";

import React from "react";
import { useTranslation } from "react-i18next";

type TransactionMessageProps = {
  message: string;
  setMessageCb: (message: string) => void;
};

export const TransactionMessageComponent = ({
  message,
  setMessageCb
}: TransactionMessageProps) => {
  const { t } = useTranslation();

  return (
    <FormGroup helperText={t("message_helper")}>
      <InputGroup
        value={message}
        placeholder={t("message")}
        className="bp3-dark"
        style={{ backgroundColor: "#21242D" }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessageCb(e.target.value)
        }
      />
    </FormGroup>
  );
};
