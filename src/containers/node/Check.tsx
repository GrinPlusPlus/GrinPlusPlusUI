import React from "react";

import {
  Spinner,
  Checkbox,
  Button,
  Intent,
  ButtonGroup,
} from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

import { ConnectedPeersComponent } from "../../components/node/ConnectedPeers";
import { NodeStatusComponent } from "../../components/node/NodeStatus";
import { Content, Flex, Title } from "../../components/styled";
import { useNavigate } from "react-router-dom";

import { useStoreState } from "../../hooks";

export const NodeCheckContainer = () => {
  const { t } = useTranslation();

  const history = useNavigate();

  const { isLoggedIn } = useStoreState((state) => state.session);

  const { headers, blocks, network, connectedPeers } = useStoreState(
    (state) => state.nodeSummary
  );

  const { isNodeRunning, isTorRunning } = useStoreState(
    (state) => state.wallet
  );

  return (
    <Content>
      <Flex>
        <div style={{ width: "70%", marginTop: "10px" }}>
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
      </Flex>
      <div>
        <br />
        <Title>{t("logs")}</Title>
        <br />
        <ButtonGroup minimal={true}>
          <Button
            onClick={() => history.push("/nodeLogs")}
            className="bp4-dark"
            intent={Intent.NONE}
          >
            {t("node_logs")}
          </Button>
          {isLoggedIn ? (
            <Button
              onClick={() => history.push("/walletLogs")}
              className="bp4-dark"
              intent={Intent.NONE}
              style={{ marginLeft: "5px" }}
            >
              {t("wallet_logs")}
            </Button>
          ) : null}
          <Button
            onClick={() => history.push("/UILogs")}
            className="bp4-dark"
            intent={Intent.NONE}
          >
            {t("ui_logs")}
          </Button>
        </ButtonGroup>
        <br />
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
    </Content>
  );
};
