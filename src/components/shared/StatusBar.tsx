import { Icon } from "@blueprintjs/core";
import React from "react";
import { StatusBarContent } from "../../components/styled";
import { useTranslation } from "react-i18next";

type StatusBarProps = {
  intent: "none" | "primary" | "success" | "warning" | "danger" | undefined;
  status: string;
  network: { height: number; outbound: number; inbound: number };
};

export const StatusBarComponent = ({
  intent,
  status,
  network,
}: StatusBarProps) => {
  const { t } = useTranslation();

  return (
    <StatusBarContent>
      <div style={{ paddingLeft: "10px", width: "40%" }}>
        <div>
          <Icon icon="symbol-circle" intent={intent} /> <b>{t("status")}</b>:{" "}
          {status}
        </div>
      </div>
      <div style={{ textAlign: "right", width: "60%", paddingRight: "35px" }}>
        <div>
          {network?.outbound} <Icon icon="arrow-up" />
          {"  "}
          {network?.inbound} <Icon icon="arrow-down" />
        </div>
      </div>
    </StatusBarContent>
  );
};
