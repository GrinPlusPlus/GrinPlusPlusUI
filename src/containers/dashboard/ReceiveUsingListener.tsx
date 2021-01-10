import { Title, Flex } from "../../components/styled";
import { Spinner } from "@blueprintjs/core";
import React from "react";
import { ReceiveUsingListenerComponent } from "../../components/transaction/receive/ReceiveUsingListener";
import { useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

export const ReceiveUsingListenerContainer = () => {
  const { t } = useTranslation();
  const { address, slatepack_address } = useStoreState(
    (state) => state.session
  );
  const { walletReachable } = useStoreState((state) => state.walletSummary);

  return (
    <div>
      <Flex>
        <Title>{t("address")}</Title>
        {address && walletReachable === undefined ? (
          <div
            style={{ paddingLeft: "10px", margin: "0px", paddingTop: "10px" }}
          >
            <Spinner size={8} />
          </div>
        ) : null}
      </Flex>
      <div style={{ marginTop: "10px" }}>
        <ReceiveUsingListenerComponent
          isWalletReachable={walletReachable}
          slatepack_address={slatepack_address}
        />
      </div>
    </div>
  );
};
