import React from "react";
import { SlatesBox } from "../styled";
import {
  Menu,
  MenuItem,
  OverlayToaster,
  Position,
  Intent,
} from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";
 
import { useTranslation } from "react-i18next";

export type SlatepackProps = {
  slatepack: string;
};

export const SlatepackComponent = ({ slatepack }: SlatepackProps) => {
  const { t } = useTranslation();

  return (
    <ContextMenu2
      className="bp4-dark"
      content={
        <Menu>
          <MenuItem
            text={t("copy_to_clipboard")}
            disabled={slatepack === undefined || slatepack.trim() === ""}
            onClick={() => {
              navigator.clipboard.writeText(slatepack);
              OverlayToaster.create({ position: Position.BOTTOM }).show({
                message: <div style={{ color: "white" }}>{t("copied")}</div>,
                intent: Intent.SUCCESS,
              });
            }}
          />
        </Menu>
      }
    >
      <SlatesBox readOnly={true} value={slatepack}></SlatesBox>
    </ContextMenu2>
  );
};
