import React from 'react';
import { HorizontallyCenter } from '../styled';

export default function LogoComponent() {
  return (
    <HorizontallyCenter>
      <img
        src={require('path').join(__dirname, "/statics/images/grin@2x.png")}
        alt=""
        style={{
          maxWidth: "60px",
          height: "auto",
          marginTop: "4px"
        }}
      />
    </HorizontallyCenter>
  );
}
