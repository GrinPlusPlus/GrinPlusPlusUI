import React from "react";

import { Spinner, Checkbox } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

import { ConnectedPeersComponent } from "../../components/node/ConnectedPeers";
import { NodeStatusComponent } from "../../components/node/NodeStatus";
import { Content, Title } from "../../components/styled";
import { NodeLogsComponent } from "../../components/logs/Node";
import { RendererLogsComponent } from "../../components/logs/Renderer";

import { useStoreState } from "../../hooks";

export const NodeCheckContainer = () => {
  const { t } = useTranslation();

  const { headers, blocks, network, connectedPeers } = useStoreState(
    (state) => state.nodeSummary
  );

  const { isNodeInstalled, isTorRunning } = useStoreState(
    (state) => state.wallet
  );

  const { logs } = useStoreState((state) => state.wallet);

  return (
    <Content>
      <div style={{ width: "75%", marginTop: "10px" }}>
        <Title>{t("node")}</Title>
        <br />
        <NodeStatusComponent
          headers={headers}
          blocks={blocks}
          network={network.height}
        />
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
      <div style={{ width: "25%", marginTop: "10px" }}>
        <Title>{t("processes")}</Title>
        <br />
        <Checkbox checked={isNodeInstalled} label="GrinNode.exe" disabled={true} />
        <Checkbox checked={isTorRunning} label="Tor.exe" disabled={true} />
        <br />
        <Title>{t("node_logs")}</Title>
        <br />
        <NodeLogsComponent logs={logs} />
        <br />
        <br />
        <Title>{t("rendeder_logs")}</Title>
        <br />
        <RendererLogsComponent logs={logs} />
      </div>
    </Content>
  );
};
