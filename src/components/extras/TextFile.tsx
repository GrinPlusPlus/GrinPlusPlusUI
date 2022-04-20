import React from "react";
import { TextFileBox } from "../styled";

import {
  Menu,
  MenuItem,
  OverlayToaster,
  Position,
  Intent,
} from "@blueprintjs/core";

import { ContextMenu2 } from "@blueprintjs/popover2";

import { useTranslation } from "react-i18next";

type TextFileComponentProps = {
  content: string;
};

export const TextFileComponent = ({ content }: TextFileComponentProps) => {
  const { t } = useTranslation();

  return (
    <ContextMenu2
      className="bp4-dark"
      content={
        <Menu>
          <MenuItem
            text={t("copy_to_clipboard")}
            onClick={() => {
              navigator.clipboard.writeText(content);
              OverlayToaster.create({ position: Position.BOTTOM }).show({
                message: <div style={{ color: "white" }}>{t("copied")}</div>,
                intent: Intent.SUCCESS,
              });
            }}
          />
        </Menu>
      }
    >
      <div style={{ width: "100%", height: "calc(100vh - 0px)" }}>
        <TextFileBox defaultValue={content}></TextFileBox>
      </div>
    </ContextMenu2>
  );
};
