import { Center, HorizontallyCenter } from "../styled";

import React from "react";
import { Spinner } from "@blueprintjs/core";

export const LoadingComponent = () => {
  return (
    <Center>
      <HorizontallyCenter>
        <Spinner size={30} />
      </HorizontallyCenter>
    </Center>
  );
};
