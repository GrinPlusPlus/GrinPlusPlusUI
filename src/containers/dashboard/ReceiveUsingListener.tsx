import { HorizontallyCenter, Title, Flex } from "../../components/styled";
import { Spinner, Text } from "@blueprintjs/core";
import React from "react";
import { ReceiveUsingListenerComponent } from "../../components/transaction/receive/ReceiveUsingListener";
import { useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

export const ReceiveUsingListenerContainer = () => {
  const { t } = useTranslation();
  const { address, slatepack_address } = useStoreState((state) => state.session);
  const { walletReachable } = useStoreState((state) => state.walletSummary);

  return (
    <div>
      <Flex>
        <Title>{t("receive")}</Title>
        {address && walletReachable === undefined ? (
          <div style={{ padding: "10px" }}>
            <Spinner size={12} />
          </div>
        ) : null}
      </Flex>
      <div>
        {address ? (
          <ReceiveUsingListenerComponent
            isWalletReachable={walletReachable}
            slatepack_address={slatepack_address}
            httpAddress={`http://${address}.grinplusplus.com/`}
            shortenHttpAddress={`http://${address.replace(
              address.substr(
                address.length / 2 - address.length / 4,
                (address.length / 4) * 2
              ),
              ".........."
            )}.grinplusplus.com/`}
          />
        ) : (
          <HorizontallyCenter>
            <Spinner size={30} />
            <Text>{t("trying_get_address")}</Text>
          </HorizontallyCenter>
        )}
      </div>
    </div>
  );
};
