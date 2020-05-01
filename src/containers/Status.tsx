import React from "react";
import { HorizontallyCenter } from "../components/styled";
import { NodeStatusComponent } from "../components/node/NodeStatus";
import { ConnectedPeersComponent } from "../components/node/ConnectedPeers";
import { useStoreActions, useStoreState } from "../hooks";
import { useInterval } from "../helpers";
import { IPeer } from "../interfaces/IPeer";

export const StatusContainer = () => {
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
    <HorizontallyCenter>
      <NodeStatusComponent
        headers={headers}
        blocks={blocks}
        network={network.height}
      />
      <br /> <br />
      <ConnectedPeersComponent peers={connectedPeers} />
    </HorizontallyCenter>
  );
};
