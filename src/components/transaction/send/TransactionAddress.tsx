import React from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

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
  setAddressCb
}: TransactionAddressProps) => {
  const { t } = useTranslation();

  const pasteButton = (
    <Button
      minimal={true}
      className="bp3-dark"
      disabled={spendable <= 0 || fee === 0}
      icon="clipboard"
      onClick={async () => setAddressCb(await navigator.clipboard.readText())}
    />
  );

  return (
    <InputGroup
      className="bp3-dark"
      style={{ backgroundColor: "#21242D" }}
      value={address}
      placeholder={t("address")}
      fill={true}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setAddressCb(e.target.value.trim())
      }
      rightElement={pasteButton}
    />
  );
};
