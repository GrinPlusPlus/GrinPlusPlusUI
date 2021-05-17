import { Title, Flex, HorizontallyCenter } from "../../components/styled";
import { Button, Intent } from "@blueprintjs/core";
import React, { useLayoutEffect } from "react";
import { WalletAddressComponent } from "../../components/dashboard/WalletAddress";
import { useStoreActions, useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";
import { QRCodeComponent } from "../../components/extras/QRCode";

import { useHistory } from "react-router-dom";

export const WalletAddressContainer = () => {
  const { t } = useTranslation();
  const { slatepackAddress, encodedAddress } = useStoreState(
    (state) => state.session
  );
  const { setDisplayQRCode, setEncodedAddress } = useStoreActions(
    (state) => state.session
  );
  const { walletReachable } = useStoreState((state) => state.walletSummary);

  const history = useHistory();

  useLayoutEffect(() => {
    const drawQRCode = async () => {
      const QRCode = require("qrcode");
      const data: string = await QRCode.toDataURL(slatepackAddress, {
        errorCorrectionLevel: "H",
        margin: "4",
        scale: "2",
        width: "2",
        color: {
          dark: "#000000",
          light: "#f2f2f2",
        },
      });
      setEncodedAddress(data);
    };
    if (slatepackAddress.length > 0) {
      drawQRCode();
    }
  }, [slatepackAddress, setEncodedAddress, setDisplayQRCode]);

  return (
    <Flex>
      <div>
        <Flex>
          <Title>{t("address")}</Title>
        </Flex>
        <div style={{ marginTop: "10px" }}>
          <Flex>
            <div>
              <WalletAddressComponent
                isWalletReachable={walletReachable}
                slatepackAddress={slatepackAddress}
              />
              <div style={{ marginTop: "5px" }}>
                <Flex>
                  <Button
                    style={{
                      width: "120px",
                      margin: "5px",
                      color: "black",
                    }}
                    intent={Intent.PRIMARY}
                    text={`${t("send")}`}
                    onClick={() => history.push("/send")}
                  />
                  <Button
                    style={{
                      width: "120px",
                      margin: "5px",
                      color: "black",
                    }}
                    intent={Intent.SUCCESS}
                    text={t("receive")}
                    onClick={() => history.push("/receive")}
                  />
                </Flex>
              </div>
            </div>
          </Flex>
        </div>
      </div>
      <HorizontallyCenter>
        <div
          className="bp4-dark"
          style={{
            margin: "0",
            transform: "translateY(15%)",
            top: "50%",
            backgroundColor: "#0d0d0d",
          }}
        >
          <HorizontallyCenter>
            <QRCodeComponent
              data={encodedAddress}
              slatepackAddress={slatepackAddress}
            />
          </HorizontallyCenter>
        </div>
      </HorizontallyCenter>
    </Flex>
  );
};
