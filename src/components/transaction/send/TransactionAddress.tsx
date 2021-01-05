import { Button, InputGroup } from "@blueprintjs/core";

import React from "react";

type TransactionAddressProps = {
  fee: number;
  spendable: number;
  address: string;
  setAddressCb: (address: string) => void;
};

export const TransactionAddressComponent = ({
  fee,
  spendable,
  address,
  setAddressCb,
}: TransactionAddressProps) => {
  const pasteButton = (
    <Button
      minimal={true}
      className="bp3-dark"
      icon="clipboard"
      onClick={async () => setAddressCb(await navigator.clipboard.readText())}
    />
  );

  return (
    <InputGroup
      className="bp3-dark"
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
