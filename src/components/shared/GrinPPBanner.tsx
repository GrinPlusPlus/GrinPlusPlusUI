import React from "react";
import { HorizontallyCenter } from "../styled";

export const GrinPPBannerComponent = () => {
  return (
    <HorizontallyCenter>
      <img
        src={require("path").join(__dirname, "./statics/images/banner.png")}
        alt=""
        width="350px"
        style={{
          maxWidth: "350px",
          height: "auto",
          marginTop: "50px",
          marginBottom: "10px",
        }}
      />
    </HorizontallyCenter>
  );
};
