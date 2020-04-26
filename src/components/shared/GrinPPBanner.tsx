import React from 'react';
import { HorizontallyCenter } from '../styled';

export default function GrinPPBannerComponent() {
  return (
    <HorizontallyCenter>
      <img
        src={require('path').join(__dirname, "./statics/images/banner.png")}
        alt=""
        style={{
          maxWidth: "350px",
          height: "auto",
          marginTop: "50px",
          marginBottom: "10px"
        }}
      />
    </HorizontallyCenter>
  );
}
