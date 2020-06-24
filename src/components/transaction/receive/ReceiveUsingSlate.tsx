import { SlatesBox, Title, Flex } from "../../styled";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Intent } from "@blueprintjs/core";

export type ReceiveUsingSlateProps = { slate: string };

export const ReceiveUsingSlateComponent = ({
  slate,
}: ReceiveUsingSlateProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Title>{t("slatepack")}</Title>
      <Flex>
        <SlatesBox data-testid="slatepack-box">{slate}</SlatesBox>
        <Flex>
          <Button
            minimal={true}
            large={true}
            intent={Intent.SUCCESS}
            text={t("receive")}
            onClick={() => {}}
          />
          <Button
            minimal={true}
            large={true}
            intent={Intent.PRIMARY}
            text={t("finalize")}
            onClick={() => {}}
          />
        </Flex>
      </Flex>
    </div>
  );
};
