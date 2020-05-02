import React, { useEffect } from "react";
import { ConnectedPeersComponent } from "../../components/node/ConnectedPeers";
import { NodeStatusComponent } from "../../components/node/NodeStatus";
import { Spinner } from "@blueprintjs/core";
import { useStoreActions, useStoreState } from "../../hooks";

export const NodeCheckContainer = () => {
  const { headers, blocks, network, connectedPeers } = useStoreState(
    (state) => state.nodeSummary
  );

  const { getConnectedPeers, setConnectedPeers } = useStoreActions(
    (actions) => actions.nodeSummary
  );

  async function getPeers() {
    try {
      setConnectedPeers(await getConnectedPeers());
    } catch (error) {
      require("electron-log").error(
        `Error trying to get Connected Peers: ${error.message}`
      );
    }
  }

  useEffect(() => {
    let timer = setTimeout(() => getPeers(), 3000);
    return () => {
      clearTimeout(timer);
    };
  });

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
