import {
  SlatesBox,
  Flex,
  Title,
  HorizontallyCenter,
  Right,
} from "../../styled";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Intent, ContextMenu, Menu, MenuItem } from "@blueprintjs/core";
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
        <Right>
          <Button
            disabled={
              validateSlatepack(require("electron").clipboard.readText()) ===
              false
            }
            intent={Intent.PRIMARY}
            minimal={true}
            text={t("paste_from_clipboard")}
            onClick={() => {
              setSlatepackTextCb(require("electron").clipboard.readText());
            }}
          />
        </Right>
      </Flex>
      <div style={{ marginTop: "5px", marginBottom: "5px" }}>
        <ContextMenu
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
        </ContextMenu>
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
