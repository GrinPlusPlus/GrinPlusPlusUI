import React from "react";
import { TextFileBox } from "../styled";

type TextFileComponentProps = {
  content: string;
};

export const TextFileComponent = ({ content }: TextFileComponentProps) => {
  return <TextFileBox>{content}</TextFileBox>;
};
