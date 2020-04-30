import Finalize from "./Finalize";
import Logs from "./Logs";
import React from "react";
import ReceiveUsingFile from "./ReceiveUsingFile";
import ReceiveUsingListener from "./ReceiveUsingListener";
import WalletActivitiy from "./WalletActivity";
import WalletBalance from "./WalletBalance";
import { Button, Intent } from "@blueprintjs/core";
import { Content, Flex } from "../../components/styled";
import { useHistory } from "react-router-dom";

export const DashboardContainer = () => {
  let history = useHistory();

  return (
    <Content>
      <div style={{ width: "45%", margin: "15px" }}>
        <Flex>
          <WalletBalance />
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
          <ReceiveUsingListener />
          <div style={{ marginTop: "30px" }}>
            <ReceiveUsingFile />
          </div>
        </div>
        <div style={{ marginTop: "30px" }}>
          <Finalize />
        </div>
        <div style={{ marginTop: "30px" }}>
          <Logs />
        </div>
      </div>
      <div style={{ width: "55%", margin: "10px" }}>
        <WalletActivitiy />
      </div>
    </Content>
  );
};
