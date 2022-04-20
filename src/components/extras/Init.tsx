import { Center, HorizontallyCenter } from "../styled";
import { Button, Icon, Intent, Spinner, Text } from "@blueprintjs/core";

import { GrinPPBannerComponent } from "../shared/GrinPPBanner";
import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

export type InitComponentProps = {
  error: boolean;
  message: string;
};

export const InitComponent = ({ error, message }: InitComponentProps) => {
  const { t } = useTranslation();

  const history = useHistory();

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
                icon={
                  error ? (
                    <Icon icon="error" color="red" size={28} />
                  ) : (
                    <Icon icon="tick-circle" color="green" size={28} />
                  )
                }
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
                onClick={() => history.push("/UILogs")}
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
