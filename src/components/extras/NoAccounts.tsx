import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { HorizontallyCenter } from "../styled";
import { useHistory } from "react-router-dom";

export const NoAccountsComponent = () => {
  let history = useHistory();

  return (
    <div style={{ width: "100%" }}>
      <br />
      <Button
        intent={Intent.PRIMARY}
        style={{ color: "black", width: "200px" }}
        large={true}
        text="Create a new Wallet"
        onClick={() => history.push("/create")}
      />
      <br />
      <br />
      <HorizontallyCenter>
        <Button
          minimal={true}
          large={true}
          text="Restore Wallet"
          onClick={() => history.push("/restore")}
        />{" "}
      </HorizontallyCenter>
    </div>
  );
};
