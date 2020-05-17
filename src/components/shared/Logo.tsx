import { HorizontallyCenter } from "../styled";
import React from "react";
import { getResourcePath } from "../../helpers";

export const LogoComponent = () => {
  return (
    <HorizontallyCenter>
      <img
        src={getResourcePath("./statics/images/grinpp.png")}
        alt=""
        width="60px"
        style={{
          maxWidth: "60px",
          height: "auto",
          marginTop: "4px"
        }}
      />
    </HorizontallyCenter>
  );
};
