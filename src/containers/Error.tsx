import React from "react";
import { Center, HorizontallyCenter } from "../components/styled";
import { Text } from "@blueprintjs/core";

export const ErrorContainer = () => {
  return (
    <Center>
      <HorizontallyCenter>
        <Text>
          What?! please restart the Wallet{" "}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </Text>
      </HorizontallyCenter>
    </Center>
  );
};
