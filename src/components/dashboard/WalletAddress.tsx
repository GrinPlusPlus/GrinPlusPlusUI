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
    <ControlGroup fill={false} vertical={false}>
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
        text={slatepackAddress}
      />
      <Button
        style={{ color: "black" }}
        className="bp3-dark"
        minimal={true}
        icon="duplicate"
        onClick={() => {
          navigator.clipboard.writeText(slatepackAddress);
          Toaster.create({ position: Position.BOTTOM }).show({
            message: <div style={{ color: "white" }}>{t("copied")}</div>,
            intent: Intent.SUCCESS,
          });
        }}
      />
      <Button
        minimal={true}
        className="bp3-dark"
        style={{ color: "black" }}
        icon="barcode"
        onClick={onBarcodeButtonClickedCb}
      />
    </ControlGroup>
  );
};
