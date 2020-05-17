import { LogsComponent, LogsProps } from "../Logs";
import { fireEvent, render, waitForElement } from "@testing-library/react";

import React from "react";

function renderLogsComponent(props: Partial<LogsProps> = {}) {
  const defaultProps: LogsProps = {
    logs: ""
  };
  return render(<LogsComponent {...defaultProps} {...props} />);
}

describe("<LogsComponent />", () => {
  test("should display a blank box", async () => {
    const { findByTestId } = renderLogsComponent();
    const box = await findByTestId("logs-box");
    expect(box.textContent).toContain("");
  });
  test("should update logs", async () => {
    const { findByTestId } = renderLogsComponent({ logs: "THIS IS A TEST" });
    const box = await findByTestId("logs-box");
    expect(box.textContent).toContain("THIS IS A TEST");
  });
});
