import React from "react";
import { Title, Flex } from "../../components/styled";
import { Button, Intent } from "@blueprintjs/core";
import { WalletAddressComponent } from "../../components/dashboard/WalletAddress";
import {  useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

import { useHistory } from "react-router-dom";

export const WalletAddressContainer = () => {
  const { t } = useTranslation();
  const { slatepackAddress } = useStoreState(
    (state) => state.session
  );

  const { walletReachable } = useStoreState((state) => state.walletSummary);

  const history = useHistory();

  return (
    <Flex>
      <div>
        <Flex>
          <Title>{t("address")}</Title>
        </Flex>
        <div style={{ marginTop: "10px" }}>
          <Flex>
            <div>
              <WalletAddressComponent
                isWalletReachable={walletReachable}
                slatepackAddress={slatepackAddress}
              />
              <div style={{ marginTop: "5px" }}>
                <Flex>
                  <Button
                    style={{
                      width: "120px",
                      margin: "5px",
                      color: "black",
                    }}
                    intent={Intent.PRIMARY}
                    text={`${t("send")}`}
                    onClick={() => history.push("/send")}
                  />
                  <Button
                    style={{
                      width: "120px",
                      margin: "5px",
                      color: "black",
                    }}
                    intent={Intent.SUCCESS}
                    text={t("receive")}
                    onClick={() => history.push("/receive")}
                  />
                </Flex>
              </div>
            </div>
          </Flex>
        </div>
      </div>
    </Flex>
  );
};
