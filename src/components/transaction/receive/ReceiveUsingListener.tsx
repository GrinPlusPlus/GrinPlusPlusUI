import React from "react";

import { Button, Intent, Toaster, Position } from "@blueprintjs/core";

import { HorizontallyCenter } from "../../styled";

import { useTranslation } from "react-i18next";

type ReceiveUsingListenerProps = {
  slatepack_address: string;
  isWalletReachable: boolean | undefined;
};
export const ReceiveUsingListenerComponent = ({
  slatepack_address,
  isWalletReachable,
}: ReceiveUsingListenerProps) => {
  const { t } = useTranslation();

  return (
    <HorizontallyCenter>
      <Button
        className="bp3-dark"
        rightIcon="duplicate"
        intent={
          isWalletReachable === undefined
            ? Intent.NONE
            : isWalletReachable
            ? Intent.SUCCESS
            : Intent.WARNING
        }
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
  );
};
