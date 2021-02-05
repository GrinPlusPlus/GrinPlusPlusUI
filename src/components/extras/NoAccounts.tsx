import { Button, Intent } from "@blueprintjs/core";

import { HorizontallyCenter } from "../styled";
import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const NoAccountsComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div style={{ width: "100%" }}>
      <br />
      <Button
        intent={Intent.PRIMARY}
        style={{ color: "black", width: "200px" }}
        large={true}
        text={t("create_wallet")}
        onClick={() => history.push("/create")}
      />
      <br />
      <br />
      <HorizontallyCenter>
        <Button
          minimal={true}
          large={true}
          text={t("restore_wallet")}
          onClick={() => history.push("/restore")}
        />
      </HorizontallyCenter>
    </div>
  );
};
