import { Title, Flex, HorizontallyCenter } from "../../components/styled";
import { Classes, Overlay, Spinner, Text } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { WalletAddressComponent } from "../../components/dashboard/WalletAddress";
import { useStoreActions, useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";
import { QRCodeComponent } from "../../components/extras/QRCode";
import classNames from "classnames";

export const WalletAddressContainer = () => {
  const { t } = useTranslation();
  const {
    address,
    slatepackAddress,
    displayQRCode,
    encodedAddress,
  } = useStoreState((state) => state.session);
  const { setDisplayQRCode, setEncodedAddress } = useStoreActions(
    (state) => state.session
  );
  const { walletReachable } = useStoreState((state) => state.walletSummary);

  const onBarcodeButtonClicked = useCallback(async () => {
    const QRCode = require("qrcode");
    const data: string = await QRCode.toDataURL(slatepackAddress);
    setEncodedAddress(data);
    setDisplayQRCode(true);
  }, [slatepackAddress, setEncodedAddress, setDisplayQRCode]);

  const qrClasses = classNames("bp3-dark", Classes.CARD, Classes.ELEVATION_4);

  return (
    <div>
      <Flex>
        <Title>{t("address")}</Title>
        <div style={{ marginLeft: "10px" }}>
          {address && walletReachable === undefined ? (
            <div style={{ marginTop: "10px" }}>
              <Spinner size={10} />
            </div>
          ) : (
            <div style={{ marginTop: "6px" }}>
              <Text>
                {walletReachable
                  ? t("wallet_reachable")
                  : t("wallet_not_reachable")}
              </Text>
            </div>
          )}
        </div>
      </Flex>
      <div style={{ marginTop: "10px" }}>
        <WalletAddressComponent
          isWalletReachable={walletReachable}
          slatepackAddress={slatepackAddress}
          onBarcodeButtonClickedCb={onBarcodeButtonClicked}
        />
      </div>
      <Overlay
        isOpen={displayQRCode}
        onClose={() => {
          setDisplayQRCode(false);
        }}
      >
        <div
          className={qrClasses}
          style={{
            top: "50%",
            left: "50%",
            position: "fixed",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#060707",
          }}
        >
          <HorizontallyCenter>
            <QRCodeComponent
              data={encodedAddress}
              slatepackAddress={slatepackAddress}
            />
          </HorizontallyCenter>
        </div>
      </Overlay>
    </div>
  );
};
