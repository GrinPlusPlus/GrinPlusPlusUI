import { NodeStatusComponent, NodeStatusProps } from "../NodeStatus";
import React from "react";
import { fireEvent, render, waitForElement } from "@testing-library/react";

function renderNodeStatusComponent(props: Partial<NodeStatusProps> = {}) {
  const defaultProps: NodeStatusProps = {
    headers: 1000,
    blocks: 999,
    network: 998,
  };
  return render(<NodeStatusComponent {...defaultProps} {...props} />);
}

describe("<NodeStatusComponent />", () => {
  test("Init state", async () => {
    const { findByTestId } = renderNodeStatusComponent();
    const headers = (await findByTestId("headers")) as HTMLTableCellElement;
    const blocks = (await findByTestId("blocks")) as HTMLTableCellElement;
    const network = (await findByTestId("network")) as HTMLTableCellElement;
    expect(headers.textContent).toBe("1000");
    expect(blocks.textContent).toBe("999");
    expect(network.textContent).toBe("998");
  });
});
