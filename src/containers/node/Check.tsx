import React from "react";

import { Spinner, Checkbox, Button, Intent } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

import { ConnectedPeersComponent } from "../../components/node/ConnectedPeers";
import { NodeStatusComponent } from "../../components/node/NodeStatus";
import { Content, Flex, Title } from "../../components/styled";
import { useHistory } from "react-router-dom";

import { useStoreState } from "../../hooks";

export const NodeCheckContainer = () => {
  const { t } = useTranslation();

  let history = useHistory();

  const { isLoggedIn } = useStoreState((state) => state.session);

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
        <Title>{t("logs")}</Title>
        <br />
        <Flex>
          <Button
            onClick={() => history.push("/nodeLogs")}
            className="bp3-dark"
            style={{ color: "black" }}
            intent={Intent.PRIMARY}
          >
            {t("node_logs")}
          </Button>
          {isLoggedIn ? (
            <Button
              onClick={() => history.push("/walletLogs")}
              className="bp3-dark"
              intent={Intent.WARNING}
              style={{ marginLeft: "5px" }}
            >
              {t("wallet_logs")}
            </Button>
          ) : null}
        </Flex>
        <br />
        <Title>{t("connected_peers")}</Title>
        <br />
        <div style={{ height: "390px", maxHeight: "390px", overflowY: "auto" }}>
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
