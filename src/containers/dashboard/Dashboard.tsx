import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { Content, Flex } from "../../components/styled";
import { FinalizeContainer } from "./Finalize";
import { LogsContainer } from "./Logs";
import { ReceiveUsingFileContainer } from "./ReceiveUsingFile";
import { ReceiveUsingListenerContainer } from "./ReceiveUsingListener";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { WalletActivitiyContainer } from "./WalletActivity";
import { WalletBalanceContainer } from "./WalletBalance";

export const DashboardContainer = () => {
  const { t } = useTranslation();

  let history = useHistory();

  return (
    <Content>
      <div style={{ width: "42%", margin: "10px" }}>
        <Flex>
          <WalletBalanceContainer />
          <div
            style={{
              width: "100%",
              textAlign: "right"
            }}
          >
            <Button
              className="bp3-dark"
              large={true}
              style={{
                color: "black",
                height: "40px",
                marginTop: "15px"
              }}
              intent={Intent.PRIMARY}
              text={`${t("send_grins")} ツ`}
              onClick={() => history.push("/send")}
            />
          </div>
        </Flex>
        <div style={{ marginTop: "30px" }}>
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
      <div style={{ width: "58%", margin: "10px" }}>
        <WalletActivitiyContainer />
      </div>
    </Content>
  );
};
