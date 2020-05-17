import React from "react";
import { ConnectedPeersComponent } from "../../components/node/ConnectedPeers";
import { NodeStatusComponent } from "../../components/node/NodeStatus";
import { Spinner } from "@blueprintjs/core";
import { useStoreState } from "../../hooks";

export const NodeCheckContainer = () => {
  const { headers, blocks, network, connectedPeers } = useStoreState(
    state => state.nodeSummary
  );

  return (
    <div>
      <br />
      <NodeStatusComponent
        headers={headers}
        blocks={blocks}
        network={network.height}
      />
      <br /> <br />
      <div style={{ height: "450px", maxHeight: "450px", overflowY: "auto" }}>
        {connectedPeers.length === 0 ? (
          <Spinner />
        ) : (
          <ConnectedPeersComponent peers={connectedPeers} />
        )}
      </div>
    </div>
  );
};
