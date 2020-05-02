import React, { useEffect } from "react";
import { NodeStatusComponent } from "../../components/node/NodeStatus";
import { ConnectedPeersComponent } from "../../components/node/ConnectedPeers";
import { useStoreActions, useStoreState } from "../../hooks";
import { Spinner } from "@blueprintjs/core";

export const NodeCheckContainer = () => {
  const { headers, blocks, network, connectedPeers } = useStoreState(
    (state) => state.nodeSummary
  );

  const { getConnectedPeers, setConnectedPeers } = useStoreActions(
    (actions) => actions.nodeSummary
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const peers = await getConnectedPeers();
        setConnectedPeers(peers);
      } catch (error) {
        require("electron-log").info(
          `Error trying to get Connected Peers: ${error.message}`
        );
      }
    }, 3000);
    return () => clearInterval(interval);
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
