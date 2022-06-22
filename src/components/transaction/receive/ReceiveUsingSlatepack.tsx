import {
  SlatesBox,
  Flex,
  Title,
  HorizontallyCenter,
} from "../../styled";

import React from "react";
import { Button, Intent, Menu, MenuItem } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";

import { useTranslation } from "react-i18next";

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
        <ContextMenu2
          className="bp4-dark"
          content={
            <Menu>
              <MenuItem
                text={t("paste_from_clipboard")}
                onClick={() => {
                  setSlatepackTextCb(require("electron").clipboard.readText());
                }}
              />
            </Menu>
          }
        >
          <SlatesBox
            data-testid="slatepack-box"
            value={slate}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setSlatepackTextCb(event.target.value);
            }}
          ></SlatesBox>
        </ContextMenu2>
      </div>
      <HorizontallyCenter>
        <Button
          disabled={
            slate === undefined ||
            slate === "" ||
            validateSlatepack(slate) === false
          }
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
