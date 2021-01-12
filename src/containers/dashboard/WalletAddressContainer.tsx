import { Title, Flex } from "../../components/styled";
import { Spinner, Text } from "@blueprintjs/core";
import React from "react";
import { WalletAddressComponent } from "../../components/dashboard/WalletAddress";
import { useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

export const WalletAddressContainer = () => {
  const { t } = useTranslation();
  const { address, slatepack_address } = useStoreState(
    (state) => state.session
  );
  const { walletReachable } = useStoreState((state) => state.walletSummary);

  return (
    <div>
      <Flex>
        <Title>{t("address")}</Title>
        <div style={{ marginLeft: "10px" }}>
          {address && walletReachable === undefined ? (
            <div style={{ marginTop: "10px" }}>
              <Spinner size={10} />
            </div>
          ) : (
            <div style={{ marginTop: "6px" }}>
              <Text>
                {walletReachable
                  ? t("wallet_reachable")
                  : t("wallet_not_reachable")}
              </Text>
            </div>
          )}
        </div>
      </Flex>
      <div style={{ marginTop: "10px" }}>
        <WalletAddressComponent
          isWalletReachable={walletReachable}
          slatepack_address={slatepack_address}
        />
      </div>
    </div>
  );
};
