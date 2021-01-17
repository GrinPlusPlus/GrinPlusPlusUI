import { Content, Flex } from "../../components/styled";

import React from "react";
import { WalletAddressContainer } from "./WalletAddressContainer";
import { WalletActivitiyContainer } from "./WalletActivity";
import { WalletBalanceContainer } from "./WalletBalance";
import { WalletBalanceDetailsContainer } from "./WalletBalanceDetails";

export const DashboardContainer = () => {
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
