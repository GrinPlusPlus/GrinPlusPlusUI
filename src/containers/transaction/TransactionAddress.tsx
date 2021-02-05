import { ControlGroup, FormGroup } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";

import React from "react";
import { TransactionAddressComponent } from "../../components/transaction/send/TransactionAddress";
import { useTranslation } from "react-i18next";

export const TransactionAddressContainer = () => {
  const { t } = useTranslation();
  const { address } = useStoreState((state) => state.sendCoinsModel);
  const { setAddress } = useStoreActions((actions) => actions.sendCoinsModel);

  return (
    <FormGroup label={`${t("address")}:`} inline={true}>
      <ControlGroup fill={true}>
        <TransactionAddressComponent
          address={address}
          setAddressCb={setAddress}
        />
      </ControlGroup>
    </FormGroup>
  );
};
