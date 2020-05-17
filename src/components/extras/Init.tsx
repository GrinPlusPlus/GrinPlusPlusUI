import { Center, HorizontallyCenter } from "../styled";
import { Icon, Intent, Spinner, Text } from "@blueprintjs/core";

import { GrinPPBannerComponent } from "../shared/GrinPPBanner";
import React from "react";

export type InitComponentProps = {
  isInitialized: boolean;
  error: boolean;
  message: string;
};

export const InitComponent = ({
  isInitialized,
  error,
  message
}: InitComponentProps) => {
  return (
    <Center>
      <HorizontallyCenter>
        <GrinPPBannerComponent />
      </HorizontallyCenter>
      {!isInitialized && !error ? (
        <div data-testid="init-spinner">
          <HorizontallyCenter>
            <Spinner size={30} />
          </HorizontallyCenter>
        </div>
      ) : (
        <HorizontallyCenter>
          <Icon
            data-testid="init-icon"
            intent={error ? Intent.DANGER : Intent.SUCCESS}
            iconSize={28}
            icon={error ? "error" : "tick-circle"}
          />
        </HorizontallyCenter>
      )}
      <div style={{ margin: "10px" }}>
        <HorizontallyCenter>
          <Text>{message}</Text>
        </HorizontallyCenter>
      </div>
    </Center>
  );
};
