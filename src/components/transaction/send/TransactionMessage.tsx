import { FormGroup, InputGroup } from "@blueprintjs/core";

import React from "react";
import { useTranslation } from "react-i18next";

type TransactionMessageProps = {
  message: string;
  setMessageCb: (message: string) => void;
};

export const TransactionMessageComponent = ({
  message,
  setMessageCb,
}: TransactionMessageProps) => {
  const { t } = useTranslation();

  return (
    <FormGroup label={`${t("message")}:`} inline={true}>
      <InputGroup
        value={message}
        className="bp3-dark"
        style={{ backgroundColor: "#21242D", width: "365px" }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessageCb(e.target.value)
        }
      />
    </FormGroup>
  );
};
