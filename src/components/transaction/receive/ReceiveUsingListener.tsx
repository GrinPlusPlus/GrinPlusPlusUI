import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

type ReceiveUsingListenerProps = {
  address: string;
  httpAddress: string;
  shortenHttpAddress: string;
};
export default function ReceiveUsingListenerComponent({
  address,
  httpAddress,
  shortenHttpAddress,
}: ReceiveUsingListenerProps) {
  return (
    <div>
      <div style={{ marginTop: "15px" }}>
        <Button
          className="bp3-dark"
          intent={Intent.SUCCESS}
          minimal={true}
          rightIcon="duplicate"
          text={address}
          onClick={() => navigator.clipboard.writeText(address)}
        />
      </div>
      <div>
        <Button
          className="bp3-dark"
          intent={Intent.NONE}
          minimal={true}
          rightIcon="duplicate"
          text={shortenHttpAddress}
          onClick={() => navigator.clipboard.writeText(httpAddress)}
        />
      </div>
    </div>
  );
}
