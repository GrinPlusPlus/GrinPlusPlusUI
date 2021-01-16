import { Button, Intent } from "@blueprintjs/core";
import { Content, Flex, HorizontallyCenter } from "../../components/styled";

import { ReceiveUsingSlateContainer } from "./ReceiveUsingSlate";
import React from "react";
import { WalletAddressContainer } from "./WalletAddressContainer";
import { WalletActivitiyContainer } from "./WalletActivity";
import { WalletBalanceContainer } from "./WalletBalance";
import { WalletBalanceDetailsContainer } from "./WalletBalanceDetails";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const DashboardContainer = () => {
  const { t } = useTranslation();

  let history = useHistory();

  return (
    <Content>
      <div style={{ margin: "15px" }}>
        <Flex>
          <div>
            <WalletBalanceContainer />
            <div style={{ marginTop: "10px" }}>
              <WalletBalanceDetailsContainer />
            </div>
          </div>
          <div style={{ marginLeft: "30px", width: "100%" }}>
            <WalletAddressContainer />
          </div>
        </Flex>
        <div style={{ marginTop: "20px" }}>
          <WalletActivitiyContainer />
        </div>
      </div>
    </Content>
  );
};
