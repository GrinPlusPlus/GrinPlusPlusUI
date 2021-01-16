import React from "react";

type QRCodeComponentProps = {
  data: string;
  slatepackAddress: string;
};
export const QRCodeComponent = ({
  data,
  slatepackAddress,
}: QRCodeComponentProps) => {
  return <img src={data} alt={slatepackAddress} style={{ margin: "5px" }} />;
};
