import { Button, Intent } from "@blueprintjs/core";

import { HorizontallyCenter } from "../../styled";
import React from "react";

type ReceiveUsingListenerProps = {
  slatepack_address: string;
  httpAddress: string;
  shortenHttpAddress: string;
  isWalletReachable: boolean | undefined;
};
export const ReceiveUsingListenerComponent = ({
  slatepack_address,
  httpAddress,
  shortenHttpAddress,
  isWalletReachable,
}: ReceiveUsingListenerProps) => {
  return (
    <div style={{ marginTop: "10px" }}>
      <HorizontallyCenter>
        <Button
          className="bp3-dark"
          intent={Intent.NONE}
          minimal={true}
          text={slatepack_address}
          onClick={() => navigator.clipboard.writeText(slatepack_address)}
        />
      </HorizontallyCenter>
      <HorizontallyCenter>
        <Button
          className="bp3-dark"
          intent={
            isWalletReachable === undefined
              ? Intent.NONE
              : isWalletReachable
              ? Intent.SUCCESS
              : Intent.WARNING
          }
          minimal={true}
          text={shortenHttpAddress}
          onClick={() => navigator.clipboard.writeText(httpAddress)}
        />
      </HorizontallyCenter>
    </div>
  );
};
