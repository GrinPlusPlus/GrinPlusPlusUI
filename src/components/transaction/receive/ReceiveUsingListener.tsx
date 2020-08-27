import React from "react";

import { Button, Intent, Toaster, Position } from "@blueprintjs/core";

import { HorizontallyCenter } from "../../styled";

import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: "10px" }}>
      <HorizontallyCenter>
        <Button
          className="bp3-dark"
          intent={Intent.NONE}
          minimal={true}
          text={slatepack_address}
          onClick={() => {
            navigator.clipboard.writeText(slatepack_address);
            Toaster.create({ position: Position.BOTTOM }).show({
              message: <div style={{ color: "black" }}>{t("copied")}</div>,
              intent: Intent.NONE,
            });
          }}
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
          onClick={() => {
            navigator.clipboard.writeText(httpAddress);
            Toaster.create({ position: Position.BOTTOM }).show({
              message: <div style={{ color: "black" }}>{t("copied")}</div>,
              intent: Intent.NONE,
            });
          }}
        />
      </HorizontallyCenter>
    </div>
  );
};
