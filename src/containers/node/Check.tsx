import React from "react";
import { NodeStatusComponent } from "../../components/node/NodeStatus";
import { ConnectedPeersComponent } from "../../components/node/ConnectedPeers";
import { useStoreActions, useStoreState } from "../../hooks";
import { useInterval } from "../../helpers";
import { IPeer } from "../../interfaces/IPeer";

export const NodeCheckContainer = () => {
  const { headers, blocks, network, connectedPeers } = useStoreState(
    (state) => state.nodeSummary
  );

  const { getConnectedPeers, setConnectedPeers } = useStoreActions(
    (actions) => actions.nodeSummary
  );

  useInterval(async () => {
    await getConnectedPeers().then((peers: IPeer[]) =>
      setConnectedPeers(peers)
    );
  }, 1000);

  return (
    <div>
      <br />
      <NodeStatusComponent
        headers={headers}
        blocks={blocks}
        network={network.height}
      />
      <br /> <br />
      <div style={{ maxHeight: "450px", overflowY: "auto" }}>
        <ConnectedPeersComponent peers={connectedPeers} />
      </div>
    </div>
  );
};
