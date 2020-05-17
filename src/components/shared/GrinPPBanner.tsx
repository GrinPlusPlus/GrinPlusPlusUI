import React from "react";
import { HorizontallyCenter } from "../styled";
import { getResourcePath } from "../../helpers";

export const GrinPPBannerComponent = () => {
  return (
    <HorizontallyCenter>
      <img
        src={getResourcePath("./statics/images/banner.png")}
        alt=""
        width="350px"
        style={{
          maxWidth: "350px",
          height: "auto",
          marginTop: "50px",
          marginBottom: "10px"
        }}
      />
    </HorizontallyCenter>
  );
};
