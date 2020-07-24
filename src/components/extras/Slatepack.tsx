import React from "react";
import { LargeSlatesBox } from "../styled";

export type SlatepackProps = {
  slatepack: string;
};

export const SlatepackComponent = ({ slatepack }: SlatepackProps) => {
  return <LargeSlatesBox>{slatepack}</LargeSlatesBox>;
};
