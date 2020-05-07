import React from "react";
import { LogsBox, Title } from "../styled";
import { useTranslation } from "react-i18next";

export type LogsProps = { logs: string };

export const LogsComponent = ({ logs }: LogsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Title>{t("logs")}</Title>
      <LogsBox data-testid="logs-box">{logs}</LogsBox>
    </div>
  );
};
