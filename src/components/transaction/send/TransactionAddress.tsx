import { Button, InputGroup } from "@blueprintjs/core";

import React from "react";

type TransactionAddressProps = {
  address: string;
  setAddressCb: (address: string) => void;
};

export const TransactionAddressComponent = ({
  address,
  setAddressCb,
}: TransactionAddressProps) => {
  const pasteButton = (
    <Button
      minimal={true}
      className="bp4-dark"
      icon="clipboard"
      onClick={async () => setAddressCb(await navigator.clipboard.readText())}
    />
  );

  return (
    <InputGroup
      className="bp4-dark"
      style={{ backgroundColor: "#21242D", width: "510px" }}
      value={address}
      fill={true}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setAddressCb(e.target.value.trim())
      }
      rightElement={pasteButton}
    />
  );
};
