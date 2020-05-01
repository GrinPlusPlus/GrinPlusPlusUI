import {
  ConnectedPeersComponent,
  ConnectedPeersProps,
} from "../ConnectedPeers";
import React from "react";
import { render } from "@testing-library/react";

function renderConnectedPeersComponent(
  props: Partial<ConnectedPeersProps> = {}
) {
  const defaultProps: ConnectedPeersProps = {
    peers: [{ address: "127.0.0.1", agent: "Grin++", direction: "outbound" }],
  };
  return render(<ConnectedPeersComponent {...defaultProps} {...props} />);
}

describe("<ConnectedPeersComponent />", () => {
  test("Init state", async () => {
    const { findByTestId } = renderConnectedPeersComponent();
    const table = (await findByTestId("peer-table")) as HTMLTableElement;
    expect(table.rows.length).toBe(2);
    expect(table.rows[1].outerHTML).toBe(
      "<tr><td>127.0.0.1</td><td>Grin++</td><td>outbound</td></tr>"
    );
  });
});
