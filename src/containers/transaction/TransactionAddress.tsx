import { ControlGroup, FormGroup } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";

import React from "react";
import { SendUsingAddressContainer } from "./SendUsingAddress";
import { TransactionAddressComponent } from "../../components/transaction/send/TransactionAddress";
import { useTranslation } from "react-i18next";

export const TransactionAddressContainer = () => {
  const { t } = useTranslation();
  const { spendable } = useStoreState(state => state.walletSummary);
  const { fee, address } = useStoreState(state => state.sendCoinsModel);
  const { setAddress } = useStoreActions(actions => actions.sendCoinsModel);

  return (
    <FormGroup helperText={t("address_helper")} inline={false}>
      <ControlGroup fill={true}>
        <TransactionAddressComponent
          fee={fee}
          spendable={spendable}
          address={address}
          setAddressCb={setAddress}
        />
        <SendUsingAddressContainer />
      </ControlGroup>
    </FormGroup>
  );
};
