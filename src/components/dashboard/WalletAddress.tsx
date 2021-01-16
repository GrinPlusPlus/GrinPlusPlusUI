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
};
export const WalletAddressComponent = ({
  slatepackAddress,
  isWalletReachable,
}: WalletAddressComponentProps) => {
  const { t } = useTranslation();

  return (
    <ControlGroup vertical={false}>
      <Button
        style={{
          textTransform: "uppercase",
          fontSize: "16px",
        }}
        minimal={true}
        className="bp3-dark"
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
        icon="duplicate"
        onClick={() => {
          navigator.clipboard.writeText(slatepackAddress);
          Toaster.create({ position: Position.BOTTOM }).show({
            message: <div style={{ color: "white" }}>{t("copied")}</div>,
            intent: Intent.SUCCESS,
          });
        }}
      />
    </ControlGroup>
  );
};
