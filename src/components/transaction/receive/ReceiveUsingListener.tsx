import { Button, Intent } from "@blueprintjs/core";

import { HorizontallyCenter } from "../../styled";
import React from "react";

type ReceiveUsingListenerProps = {
  address: string;
  httpAddress: string;
  shortenHttpAddress: string;
  isWalletReachable: boolean;
};
export const ReceiveUsingListenerComponent = ({
  address,
  httpAddress,
  shortenHttpAddress,
  isWalletReachable,
}: ReceiveUsingListenerProps) => {
  return (
    <div style={{ marginTop: "15px" }}>
      <HorizontallyCenter>
        <Button
          className="bp3-dark"
          intent={Intent.NONE}
          minimal={true}
          rightIcon="duplicate"
          text={address}
          onClick={() => navigator.clipboard.writeText(address)}
        />
      </HorizontallyCenter>
      <HorizontallyCenter>
        <Button
          className="bp3-dark"
          intent={isWalletReachable ? Intent.SUCCESS : Intent.WARNING}
          minimal={true}
          rightIcon="duplicate"
          text={shortenHttpAddress}
          onClick={() => navigator.clipboard.writeText(httpAddress)}
        />
      </HorizontallyCenter>
    </div>
  );
};
