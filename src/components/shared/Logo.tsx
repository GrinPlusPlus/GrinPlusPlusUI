import React from "react";
import { HorizontallyCenter } from "../styled";

export const LogoComponent = () => {
  return (
    <HorizontallyCenter>
      <img
        src={require("path").join(__dirname, "./statics/images/grin@2x.png")}
        alt=""
        width="60px"
        style={{
          maxWidth: "60px",
          height: "auto",
          marginTop: "4px",
        }}
      />
    </HorizontallyCenter>
  );
};
