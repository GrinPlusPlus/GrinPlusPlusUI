import React from "react";

import {
  Button,
  Intent,
  Toaster,
  Position,
  ControlGroup,
} from "@blueprintjs/core";

import { useTranslation } from "react-i18next";

type WalletAddressComponentProps = {
  slatepackAddress: string;
  isWalletReachable: boolean | undefined;
  onBarcodeButtonClickedCb: () => void;
};
export const WalletAddressComponent = ({
  slatepackAddress,
  isWalletReachable,
  onBarcodeButtonClickedCb,
}: WalletAddressComponentProps) => {
  const { t } = useTranslation();

  return (
    <ControlGroup fill={true} vertical={false}>
      <Button
        rightIcon="duplicate"
        minimal={true}
        className="bp3-dark"
        fill={true}
        onClick={() => {
          navigator.clipboard.writeText(slatepackAddress);
          Toaster.create({ position: Position.BOTTOM }).show({
            message: <div style={{ color: "white" }}>{t("copied")}</div>,
            intent: Intent.SUCCESS,
          });
        }}
        intent={
          isWalletReachable === undefined
            ? Intent.NONE
            : isWalletReachable
            ? Intent.SUCCESS
            : Intent.WARNING
        }
        text={slatepackAddress}
      />
      <Button
        minimal={true}
        className="bp3-dark"
        style={{ color: "black" }}
        icon="zoom-to-fit"
        onClick={onBarcodeButtonClickedCb}
      />
    </ControlGroup>
  );
};
