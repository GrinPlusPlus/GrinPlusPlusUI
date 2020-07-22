import { Button, Intent } from "@blueprintjs/core";
import { Content, Flex } from "../../components/styled";

import { FinalizeContainer } from "./Finalize";
import { ReceiveUsingSlateContainer } from "./ReceiveUsingSlate";
import React from "react";
import { ReceiveUsingFileContainer } from "./ReceiveUsingFile";
import { ReceiveUsingListenerContainer } from "./ReceiveUsingListener";
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
      <div style={{ width: "40%", margin: "5px" }}>
        <Flex>
          <WalletBalanceContainer />
          <div
            style={{
              width: "100%",
              textAlign: "right",
            }}
          >
            <Button
              className="bp3-dark"
              large={true}
              style={{
                color: "black",
                height: "40px",
                marginTop: "15px",
              }}
              intent={Intent.PRIMARY}
              text={`${t("send")} ツ`}
              onClick={() => history.push("/send")}
            />
          </div>
        </Flex>
        <div style={{ marginTop: "10px" }}>
          <WalletBalanceDetailsContainer />
        </div>
        <div style={{ marginTop: "10px" }}>
          <ReceiveUsingListenerContainer />
          <div style={{ marginTop: "10px" }}>
            <ReceiveUsingFileContainer />
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <FinalizeContainer />
        </div>
        <div style={{ marginTop: "10px" }}>
          <ReceiveUsingSlateContainer />
        </div>
      </div>
      <div style={{ width: "60%", marginLeft: "15px", marginTop: "5px" }}>
        <WalletActivitiyContainer />
      </div>
    </Content>
  );
};
