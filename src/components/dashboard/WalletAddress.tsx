import React from "react";

import { Button, Intent, Toaster, Position } from "@blueprintjs/core";

import { useTranslation } from "react-i18next";
import { HorizontallyCenter } from "../styled";

type WalletAddressComponentProps = {
  slatepack_address: string;
  isWalletReachable: boolean | undefined;
};
export const WalletAddressComponent = ({
  slatepack_address,
  isWalletReachable,
}: WalletAddressComponentProps) => {
  const { t } = useTranslation();

  return (
    <HorizontallyCenter>
      <Button
        style={{ fontSize: "15px" }}
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
            message: <div style={{ color: "white" }}>{t("copied")}</div>,
            intent: Intent.SUCCESS,
          });
        }}
      />
    </HorizontallyCenter>
  );
};
