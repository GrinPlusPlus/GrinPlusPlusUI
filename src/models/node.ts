import { Action, action, Thunk, thunk } from "easy-peasy";
import { getStateColor, getStateText } from "../helpers";
import { Injections } from "../store";
import { StoreModel } from ".";
import { INodeStatus } from "../interfaces/INodeStatus";

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
  updateInterval: number;
  connectedPeers: { address: string; agent: string; direction: string }[];
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
  setConnectedPeers: Action<
    NodeSummaryModel,
    { address: string; agent: string; direction: string }[]
  >;
  updateConnectedPeers: Thunk<
    NodeSummaryModel,
    undefined,
    Injections,
    StoreModel
  >;
}

const nodeSummary: NodeSummaryModel = {
  status: getStateText(""),
  intent: getStateColor(""),
  headers: 0,
  blocks: 0,
  network: { height: 0, outbound: 0, inbound: 0 },
  userAgent: "",
  updateInterval: 1000,
  connectedPeers: [],
  updateStatus: action((state, node) => {
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
      const api = new nodeService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      );
      return await api.getStatus();
    }
  ),
  updateConnectedPeers: thunk(
    async (actions, payload, { injections, getStoreState }) => {
      const { nodeService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      const api = new nodeService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      );
      await api
        .getConnectedPeers()
        .then((peers) => actions.setConnectedPeers(peers));
    }
  ),
  setConnectedPeers: action((state, peers) => {
    if (peers.length === 0) return;
    state.connectedPeers = [];
    for (let index = 0; index < peers.length; index++) {
      state.connectedPeers.push(peers[index]);
    }
  }),
};

export default nodeSummary;
