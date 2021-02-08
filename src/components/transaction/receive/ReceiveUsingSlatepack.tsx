import { SlatesBox, Flex, Title, HorizontallyCenter } from "../../styled";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Intent } from "@blueprintjs/core";
import { validateSlatepack } from "../../../services/utils";

export type ReceiveUsingSlatepackProps = {
  slate: string;
  onReceiveSlatepackButtonCb: (slatepack: string) => void;
  setSlatepackTextCb: (slatepack: string) => void;
};

export const ReceiveUsingSlatepackComponent = ({
  slate,
  onReceiveSlatepackButtonCb,
  setSlatepackTextCb,
}: ReceiveUsingSlatepackProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Flex>
        <Title>{t("slatepack")}</Title>
      </Flex>
      <div style={{ marginTop: "5px", marginBottom: "5px" }}>
        <SlatesBox
          data-testid="slatepack-box"
          defaultValue={slate}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setSlatepackTextCb(event.target.value);
          }}
        ></SlatesBox>
      </div>
      <HorizontallyCenter>
        <Button
          disabled={validateSlatepack(slate) === false}
          intent={Intent.SUCCESS}
          text={t("receive")}
          onClick={() => {
            onReceiveSlatepackButtonCb(slate);
          }}
        />
      </HorizontallyCenter>
    </div>
  );
};
