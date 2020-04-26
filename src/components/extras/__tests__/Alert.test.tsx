import AlertComponent, { AlertProps } from '../Alert';
import React from 'react';
import { fireEvent, render, waitForElement } from '@testing-library/react';

function renderLogsComponent(props: Partial<AlertProps> = {}) {
  function changeMessage(message: string | undefined) {
    props.message = message;
  }
  const defaultProps: AlertProps = {
    message: "",
    setMessage: (message: string | undefined) => changeMessage(message),
  };
  return render(<AlertComponent {...defaultProps} {...props} />);
}

describe("<AlertComponent />", () => {
  test("should display none", async () => {
    const { queryAllByTestId } = renderLogsComponent();
    const toast = queryAllByTestId("toast");
    expect(toast).toHaveLength(0);
  });
  test("should display a message", async () => {
    const { queryAllByText } = renderLogsComponent({ message: "ALERT!!" });
    const toast = queryAllByText("ALERT!!");
    expect(toast).toHaveLength(1);
  });
});
