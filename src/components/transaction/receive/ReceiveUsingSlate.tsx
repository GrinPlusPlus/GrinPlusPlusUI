import { SlatesBox, Title, Flex } from "../../styled";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Intent } from "@blueprintjs/core";

export type ReceiveUsingSlateProps = {
  slate: string;
  onReceiveSlatepackCb: (slatepack: string) => void;
  setSlatepackTextCb: (slatepack: string) => void;
  onFinalizeSlatepackCb: (slatepack: string) => void;
};

export const ReceiveUsingSlateComponent = ({
  slate,
  onReceiveSlatepackCb,
  setSlatepackTextCb,
  onFinalizeSlatepackCb
}: ReceiveUsingSlateProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Title>{t("slatepack")}</Title>
      <Flex>
        <SlatesBox
          data-testid="slatepack-box"
          onChange={(event: React.FormEvent<HTMLTextAreaElement>) => {
            let target = event.target as HTMLTextAreaElement;
            setSlatepackTextCb(target.value);
          }}
          value={slate}
        >
          {slate}
        </SlatesBox>
        <Flex>
          <Button
            minimal={true}
            large={true}
            intent={Intent.SUCCESS}
            text={t("receive")}
            onClick={() => { onReceiveSlatepackCb(slate); }}
          />
          <Button
            minimal={true}
            large={true}
            intent={Intent.PRIMARY}
            text={t("finalize")}
            onClick={() => { onFinalizeSlatepackCb(slate); }}
          />
        </Flex>
      </Flex>
    </div>
  );
};
