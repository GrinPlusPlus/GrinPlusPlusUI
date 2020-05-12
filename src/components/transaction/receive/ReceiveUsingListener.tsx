import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { HorizontallyCenter } from "../../styled";

type ReceiveUsingListenerProps = {
  address: string;
  httpAddress: string;
  shortenHttpAddress: string;
};
export const ReceiveUsingListenerComponent = ({
  address,
  httpAddress,
  shortenHttpAddress,
}: ReceiveUsingListenerProps) => {
  return (
    <div style={{ marginTop: "15px" }}>
      <HorizontallyCenter>
        <Button
          className="bp3-dark"
          intent={Intent.SUCCESS}
          minimal={true}
          rightIcon="duplicate"
          text={address}
          onClick={() => navigator.clipboard.writeText(address)}
        />
      </HorizontallyCenter>
      <HorizontallyCenter>
        <Button
          className="bp3-dark"
          intent={Intent.NONE}
          minimal={true}
          rightIcon="duplicate"
          text={shortenHttpAddress}
          onClick={() => navigator.clipboard.writeText(httpAddress)}
        />
      </HorizontallyCenter>
    </div>
  );
};
