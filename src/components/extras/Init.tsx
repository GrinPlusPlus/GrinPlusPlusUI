import { Center, HorizontallyCenter } from "../styled";
import { Button, Icon, Intent, Spinner, Text } from "@blueprintjs/core";

import { GrinPPBannerComponent } from "../shared/GrinPPBanner";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export type InitComponentProps = {
  error: boolean;
  message: string;
};

export const InitComponent = ({ error, message }: InitComponentProps) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <div>
      <div className="content">
        <Center>
          <HorizontallyCenter>
            <GrinPPBannerComponent />
          </HorizontallyCenter>
          {!error ? (
            <div data-testid="init-spinner">
              <HorizontallyCenter>
                <Spinner size={30} />
              </HorizontallyCenter>
            </div>
          ) : (
            <HorizontallyCenter>
              <Icon
                data-testid="init-icon"
                color="{error ? 'red' : 'green'}"
                size={28}
                icon={error ? 'error' : 'tick-circle'}
              />
            </HorizontallyCenter>
          )}
          <div style={{ margin: "10px" }}>
            <HorizontallyCenter>
              <Text>{message}</Text>
            </HorizontallyCenter>
          </div>
          {error ? (
            <HorizontallyCenter>
              <Button
                onClick={() =>  navigate("/UILogs")}
                className="bp4-dark"
                intent={Intent.WARNING}
              >
                {t("ui_logs")}
              </Button>
            </HorizontallyCenter>
          ) : null}
        </Center>
      </div>
      <div className="footer">
        <HorizontallyCenter>
          <Button
            icon="help"
            minimal={true}
            onClick={() => {
              require("electron").shell.openExternal("https://t.me/GrinPP");
            }}
          >
            Click here to Join the Grin++ Support Channel on Telegram if you
            need help.
          </Button>
        </HorizontallyCenter>
      </div>
    </div>
  );
};
