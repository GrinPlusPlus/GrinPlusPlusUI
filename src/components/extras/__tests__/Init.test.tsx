import { InitComponent, InitComponentProps } from "../Init";
import { fireEvent, render, waitForElement } from "@testing-library/react";

import React from "react";

function renderInitComponent(props: Partial<InitComponentProps> = {}) {
  const defaultProps: InitComponentProps = {
    error: false,
    message: ""
  };
  return render(<InitComponent {...defaultProps} {...props} />);
}

describe("<InitComponent />", () => {
  test("should display loading", async () => {
    const { queryAllByTestId } = renderInitComponent();
    const spinner = queryAllByTestId("init-spinner");
    expect(spinner).toHaveLength(1);
  });
  test("should display error when can not init", async () => {
    const { findByTestId } = renderInitComponent({ error: true });
    const icon = await findByTestId("init-icon");
    expect(icon.getAttribute("icon")).toEqual("error");
  });
});
