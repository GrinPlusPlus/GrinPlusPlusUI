import React from "react";

import { Spinner, Checkbox } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

import { ConnectedPeersComponent } from "../../components/node/ConnectedPeers";
import { NodeStatusComponent } from "../../components/node/NodeStatus";
import { Content, Title } from "../../components/styled";

import { useStoreState } from "../../hooks";

export const NodeCheckContainer = () => {
  const { t } = useTranslation();

  const { headers, blocks, network, connectedPeers } = useStoreState(
    (state) => state.nodeSummary
  );

  const { isNodeRunning, isTorRunning } = useStoreState(
    (state) => state.wallet
  );

  return (
    <div>
      <Content>
        <div style={{ width: "75%", marginTop: "10px" }}>
          <Title>{t("node")}</Title>
          <br />
          <NodeStatusComponent
            headers={headers}
            blocks={blocks}
            network={network.height}
          />
        </div>
        <div style={{ width: "25%", marginTop: "10px", marginLeft: "10px" }}>
          <Title>{t("processes")}</Title>
          <br />
          <Checkbox checked={isNodeRunning} label="Node" disabled={true} />
          <Checkbox checked={isTorRunning} label="Tor" disabled={true} />
        </div>
      </Content>
      <div>
        <br />
        <br />
        <Title>{t("connected_peers")}</Title>
        <br />
        <div style={{ height: "450px", maxHeight: "450px", overflowY: "auto" }}>
          {connectedPeers.length === 0 ? (
            <Spinner />
          ) : (
            <ConnectedPeersComponent peers={connectedPeers} />
          )}
        </div>
      </div>
    </div>
  );
};
