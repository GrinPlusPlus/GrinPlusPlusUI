import { Action, Thunk, action, thunk } from "easy-peasy";
import { getStateColor, getStateText } from "../helpers";

import { INodeStatus } from "../interfaces/INodeStatus";
import { IPeer } from "../interfaces/IPeer";
import { Injections } from "../store";
import { StoreModel } from ".";

export interface NodeSummaryModel {
  status: string;
  intent: any;
  headers: number;
  blocks: number;
  network: {
    height: number;
    outbound: number;
    inbound: number;
  };
  userAgent: string;
  CheckStatusInterval: number;
  HealthCheckInterval: number;
  waitingResponse: boolean;
  connectedPeers: IPeer[];
  updateStatus: Action<
    NodeSummaryModel,
    | {
        agent: string;
        status: string;
        headers: number;
        blocks: number;
        network: {
          height: number;
          outbound: number;
          inbound: number;
        };
        state: {
          downloaded: number;
          downloadSize: number;
          processingStatus: number;
        };
      }
    | undefined
  >;
  checkStatus: Thunk<NodeSummaryModel, undefined, Injections, StoreModel>;
  getConnectedPeers: Thunk<NodeSummaryModel, undefined, Injections, StoreModel>;
  setConnectedPeers: Action<NodeSummaryModel, IPeer[]>;
  setWaitingResponse: Action<NodeSummaryModel, boolean>;
  updatedAt: number;
  readNodeLogs: Thunk<NodeSummaryModel, undefined, Injections, StoreModel>;
  readWalletLogs: Thunk<NodeSummaryModel, undefined, Injections, StoreModel>;
}

const nodeSummary: NodeSummaryModel = {
  status: getStateText(""),
  intent: getStateColor(""),
  headers: 0,
  blocks: 0,
  network: { height: 0, outbound: 0, inbound: 0 },
  userAgent: "",
  CheckStatusInterval: 1000,
  HealthCheckInterval: 10000,
  connectedPeers: [],
  waitingResponse: false,
  updateStatus: action((state, node) => {
    state.updatedAt = Date.now();
    if (node === undefined) {
      state.status = getStateText("");
      state.intent = getStateColor("");
      state.userAgent = "";
      state.headers = 0;
      state.blocks = 0;
      state.network = { height: 0, outbound: 0, inbound: 0 };
      return;
    }
    state.userAgent = node.agent;
    state.status = getStateText(
      node.status,
      node.headers,
      node.network.height,
      node.blocks,
      node.state.downloaded,
      node.state.downloadSize,
      node.state.processingStatus
    );
    state.intent = getStateColor(node.status);
    state.headers = node.headers;
    state.blocks = node.blocks;
    state.network = node.network;
  }),
  checkStatus: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ): Promise<INodeStatus> => {
      const { nodeService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new nodeService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).getStatus();
    }
  ),
  getConnectedPeers: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ): Promise<IPeer[]> => {
      const { nodeService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      const api = new nodeService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      );
      return await api.getConnectedPeers();
    }
  ),
  setConnectedPeers: action((state, peers) => {
    if (peers.length === 0) return;
    state.connectedPeers = [];
    for (let index = 0; index < peers.length; index++) {
      state.connectedPeers.push(peers[index]);
    }
  }),
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
  updatedAt: 0,
  readNodeLogs: thunk(
    (actions, payload, { injections, getStoreState }): string => {
      const { utilsService } = injections;
      const settings = getStoreState().settings;
      const sep = require("path").sep;
      return utilsService.getTextFileContent(
        `${settings.nodeDataPath}${sep}LOGS${sep}Node.log`
      );
    }
  ),
  readWalletLogs: thunk(
    (actions, payload, { injections, getStoreState }): string => {
      const { utilsService } = injections;
      const settings = getStoreState().settings;
      const sep = require("path").sep;
      return utilsService.getTextFileContent(
        `${settings.nodeDataPath}${sep}LOGS${sep}Wallet.log`
      );
    }
  ),
};

export default nodeSummary;
