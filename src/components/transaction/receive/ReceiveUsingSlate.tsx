import { SlatesBox, Flex, Right } from "../../styled";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Intent } from "@blueprintjs/core";
import { validateSlatepack } from "../../../services/utils";

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
  onFinalizeSlatepackCb,
}: ReceiveUsingSlateProps) => {
  const { t } = useTranslation();

  return (
    <div>
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
      <Right>
        <Flex>
          <Button
            style={{ margin: "5px" }}
            disabled={validateSlatepack(slate) === false}
            intent={Intent.SUCCESS}
            text={t("receive")}
            onClick={() => {
              onReceiveSlatepackCb(slate);
            }}
          />
          <Button
            minimal={true}
            large={true}
            disabled={validateSlatepack(slate) === false}
            intent={Intent.PRIMARY}
            text={t("finalize")}
            onClick={() => {
              onFinalizeSlatepackCb(slate);
            }}
          />
        </Flex>
      </Right>
    </div>
  );
};
