import { InitComponent, InitComponentProps } from "../Init";
import React from "react";
import { fireEvent, render, waitForElement } from "@testing-library/react";

function renderInitComponent(props: Partial<InitComponentProps> = {}) {
  const defaultProps: InitComponentProps = {
    isInitialized: false,
    error: false,
    message: "",
  };
  return render(<InitComponent {...defaultProps} {...props} />);
}

describe("<InitComponent />", () => {
  test("should display loading", async () => {
    const { queryAllByTestId } = renderInitComponent();
    const spinner = queryAllByTestId("init-spinner");
    expect(spinner).toHaveLength(1);
  });
  test("should display check when did init", async () => {
    const { findByTestId } = renderInitComponent({ isInitialized: true });
    const icon = await findByTestId("init-icon");
    expect(icon.getAttribute("icon")).toEqual("tick-circle");
  });
});
