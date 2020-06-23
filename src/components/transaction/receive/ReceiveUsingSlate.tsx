import { SlatesBox, Title, Flex } from "../../styled";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@blueprintjs/core";

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
        <Button
          minimal={true}
          large={true}
          text={t("receive")}
          onClick={() => {}}
        />
      </Flex>
    </div>
  );
};
