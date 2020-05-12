import React from "react";
import { ReceiveUsingListenerComponent } from "../../components/transaction/receive/ReceiveUsingListener";
import { HorizontallyCenter, Title } from "../../components/styled";
import { Spinner, Text } from "@blueprintjs/core";
import { useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

export const ReceiveUsingListenerContainer = () => {
  const { t } = useTranslation();
  const { address } = useStoreState((state) => state.session);

  return (
    <div>
      <Title>{t("receive")}</Title>
      <div>
        {address ? (
          <ReceiveUsingListenerComponent
            address={address}
            httpAddress={`http://${address}.grinplusplus.com/`}
            shortenHttpAddress={`http://${address.replace(
              address.substr(
                address.length / 2 - address.length / 5,
                (address.length / 5) * 2
              ),
              ".........."
            )}.grinplusplus.com/`}
          />
        ) : (
          <div>
            <HorizontallyCenter>
              <Spinner size={30} />
              <Text>{t("trying_get_address")}</Text>
            </HorizontallyCenter>
            <br />
          </div>
        )}
      </div>
    </div>
  );
};
