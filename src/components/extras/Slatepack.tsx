import React from "react";
import { SlatesBox } from "../styled";

export type SlatepackProps = {
  slatepack: string;
};

export const SlatepackComponent = ({ slatepack }: SlatepackProps) => {
  return <SlatesBox>{slatepack}</SlatesBox>;
};
