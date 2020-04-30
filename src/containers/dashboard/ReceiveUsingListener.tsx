import React from "react";
import ReceiveUsingListenerComponent from "../../components/transaction/receive/ReceiveUsingListener";
import { HorizontallyCenter, Title } from "../../components/styled";
import { Spinner, Text } from "@blueprintjs/core";
import { useStoreState } from "../../hooks";

export default function ReceiveUsingListenerContainer() {
  const { address } = useStoreState((state) => state.session);

  return (
    <div>
      <Title>Receive</Title>
      <div>
        {address ? (
          <ReceiveUsingListenerComponent
            address={address}
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
          <div>
            <HorizontallyCenter>
              <Spinner size={30} />
              <Text>trying to get your address, please wait...</Text>
            </HorizontallyCenter>
            <br />
          </div>
        )}
      </div>
    </div>
  );
}
