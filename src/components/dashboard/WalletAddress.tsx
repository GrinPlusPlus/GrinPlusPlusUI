import React from "react";

import {
  Button,
  Intent,
  OverlayToaster,
  Position,
  ControlGroup,
} from "@blueprintjs/core";

import { useTranslation } from "react-i18next";

type WalletAddressComponentProps = {
  slatepackAddress: string;
  isWalletReachable: boolean | undefined;
  onGenerateNewAddressClickedCb: () => void
};
export const WalletAddressComponent = ({
  slatepackAddress,
  isWalletReachable,
  onGenerateNewAddressClickedCb ,
}: WalletAddressComponentProps) => {
  const { t } = useTranslation();

  return (
    <ControlGroup vertical={false}>
      <Button
        style={{
          textTransform: "lowercase",
          fontSize: "18px",
        }}
        minimal={true}
        className="bp4-dark"
        onClick={() => {
          navigator.clipboard.writeText(slatepackAddress);
          OverlayToaster.create({ position: Position.BOTTOM }).show({
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
        className="bp4-dark"
        style={{ color: "black" }}
        icon="duplicate"
        onClick={() => {
          navigator.clipboard.writeText(slatepackAddress);
          OverlayToaster.create({ position: Position.BOTTOM }).show({
            message: <div style={{ color: "white" }}>{t("copied")}</div>,
            intent: Intent.SUCCESS,
          });
        }}
      />
      <Button
        minimal={true}
        className="bp4-dark"
        style={{ color: "black" }}
        icon="refresh"
        onClick={onGenerateNewAddressClickedCb}
      />
    </ControlGroup>
  );
};
