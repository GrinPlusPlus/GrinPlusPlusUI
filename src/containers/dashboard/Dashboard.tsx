import { Content, Flex } from "../../components/styled";

import React from "react";
import { WalletAddressContainer } from "./WalletAddressContainer";
import { WalletActivitiyContainer } from "./WalletActivity";
import { WalletBalanceContainer } from "./WalletBalance";
import { WalletBalanceDetailsContainer } from "./WalletBalanceDetails";

export const DashboardContainer = () => {
  return (
    <Content>
      <div style={{ padding: "15px", width: "100%" }}>
        <div style={{ width: "100%" }}>
          <Flex>
            <div style={{ width: "23%" }}>
              <WalletBalanceContainer />
              <div style={{ paddingTop: "10px" }}>
                <WalletBalanceDetailsContainer />
              </div>
            </div>
            <div style={{ width: "77%", paddingLeft: "30px" }}>
              <WalletAddressContainer />
            </div>
          </Flex>
        </div>
        <div style={{ width: "100%", paddingTop: "20px" }}>
          <WalletActivitiyContainer />
        </div>
      </div>
    </Content>
  );
};
