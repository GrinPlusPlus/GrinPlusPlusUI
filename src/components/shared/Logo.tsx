import React from "react";
import { HorizontallyCenter } from "../styled";

export const LogoComponent = () => {
  return (
    <HorizontallyCenter>
      <img
        src="./statics/images/grin@2x.png"
        alt=""
        style={{
          maxWidth: "60px",
          height: "auto",
          marginTop: "4px",
        }}
      />
    </HorizontallyCenter>
  );
};
