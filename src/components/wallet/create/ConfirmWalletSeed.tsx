import React from "react";
import { WalletSeedInputComponent } from "../../../components/shared/WalletSeedInput";
import { Button, Callout, Classes, Intent } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

type CreateWalletProps = {
  seedsMatched: boolean;
  partiallyHiddenSeed: {
    position: number;
    text: string;
    disabled: boolean;
  }[];
  receivedSeed: {
    position: number;
    text: string;
    disabled: boolean;
  }[];
  onWordChangeCb: (word: string, position: number) => void;
  onButtonClickedCb: () => void;
};

export const WalletSeedConfirmation = ({
  seedsMatched,
  partiallyHiddenSeed,
  receivedSeed,
  onWordChangeCb,
  onButtonClickedCb,
}: CreateWalletProps) => {
  const { t } = useTranslation();
  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent="none">{t("seed_message ")}</Callout>
      <br />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <WalletSeedInputComponent
          seed={
            partiallyHiddenSeed.length === 0
              ? receivedSeed
              : partiallyHiddenSeed
          }
          onWordChangeCb={onWordChangeCb}
          length={receivedSeed.length}
        />
      </div>
      <br />
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          data-testid="wallet-seed-confirmation-button"
          intent={Intent.PRIMARY}
          onClick={onButtonClickedCb}
          disabled={!seedsMatched}
          style={{ color: "black" }}
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};
