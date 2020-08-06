import { InputPasswordComponent, InputPasswordProps } from "../InputPassword";
import { fireEvent, render, waitForElement } from "@testing-library/react";

import React from "react";

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));

function renderInputPasswordComponent(props: Partial<InputPasswordProps> = {}) {
  const defaultProps: InputPasswordProps = {
    password: "p4ssw0rD",
    cb: (password: string) => {
      return password;
    },
    autoFocus: true,
    onEnterCb: () => {
      return "p4ssw0rD";
    },
    waitingResponse: false
  };
  return render(<InputPasswordComponent {...defaultProps} {...props} />);
}

describe("<InputPasswordComponent />", () => {
  test("Init state", async () => {
    const { findByTestId } = renderInputPasswordComponent();
    const field = (await findByTestId("password-field")) as HTMLInputElement;
    expect(field.value).toBe("p4ssw0rD");
    expect(field.disabled).toBe(false);
  });
});
