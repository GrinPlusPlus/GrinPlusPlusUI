import React, { useCallback } from "react";
import { Title, Flex } from "../../components/styled";
import { Alert, Button, Intent } from "@blueprintjs/core";
import { WalletAddressComponent } from "../../components/dashboard/WalletAddress";
import { useStoreActions, useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";

import { useHistory } from "react-router-dom";

export const WalletAddressContainer = () => {
  const { t } = useTranslation();

  const {
    isConfirmationDialogOpen,
  } = useStoreState((state) => state.settings);
  const { token, slatepackAddress } = useStoreState((state) => state.session);

  const { walletReachable } = useStoreState((state) => state.walletSummary);
  const {
    toggleConfirmationDialog
  } = useStoreActions((actions) => actions.settings);

  const { generateNewSlatepackAddress } = useStoreActions((state) => state.session);

  const toggleDialog = useCallback(() => {
    toggleConfirmationDialog();
  }, [toggleConfirmationDialog]);

  const history = useHistory();

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
                onGenerateNewAddressClickedCb={toggleDialog}
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
      <Alert
        className="bp4-dark"
        cancelButtonText={t("cancel")}
        confirmButtonText={t("continue")}
        icon="refresh"
        intent={Intent.WARNING}
        isOpen={isConfirmationDialogOpen}
        onCancel={toggleDialog}
        onConfirm={async () => {
          try {
            await generateNewSlatepackAddress(token);
            toggleConfirmationDialog();
          } catch (error) { }
        }}
      >
        <p>{t("new_address_confirmation")}</p>
      </Alert>
    </Flex>
  );
};
