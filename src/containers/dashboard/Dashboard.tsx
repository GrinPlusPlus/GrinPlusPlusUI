import { FinalizeContainer } from "./Finalize";
import { LogsContainer } from "./Logs";
import React from "react";
import { ReceiveUsingFileContainer } from "./ReceiveUsingFile";
import { ReceiveUsingListenerContainer } from "./ReceiveUsingListener";
import { WalletActivitiyContainer } from "./WalletActivity";
import { WalletBalanceContainer } from "./WalletBalance";
import { Button, Intent } from "@blueprintjs/core";
import { Content, Flex } from "../../components/styled";
import { useHistory } from "react-router-dom";

export const DashboardContainer = () => {
  let history = useHistory();

  return (
    <Content>
      <div style={{ width: "45%", margin: "15px" }}>
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
                width: "150px",
                height: "50px",
                marginTop: "15px",
              }}
              intent={Intent.PRIMARY}
              text="Send Grins ツ"
              onClick={() => history.push("/send")}
            />
          </div>
        </Flex>
        <div style={{ marginTop: "20px" }}>
          <ReceiveUsingListenerContainer />
          <div style={{ marginTop: "30px" }}>
            <ReceiveUsingFileContainer />
          </div>
        </div>
        <div style={{ marginTop: "30px" }}>
          <FinalizeContainer />
        </div>
        <div style={{ marginTop: "30px" }}>
          <LogsContainer />
        </div>
      </div>
      <div style={{ width: "55%", margin: "10px" }}>
        <WalletActivitiyContainer />
      </div>
    </Content>
  );
};
