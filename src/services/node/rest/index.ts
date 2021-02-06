import { BaseApi } from "./../../api";
import { INodeStatus } from "../../../interfaces/INodeStatus";
import { IPeer } from "../../../interfaces/IPeer";

export class NodeAPI extends BaseApi {
  async getStatus(): Promise<INodeStatus> {
    return await this.makeRESTRequest(this.getRequestURL("node_status"), "get")
      .then((response) => {
        const data = JSON.parse(response);

        return {
          headerHeight: data.header_height,
          status: data.sync_status,
          agent: data.user_agent,
          headers: data.header_height,
          blocks: data.chain?.height,
          network: {
            height: data.network.height,
            outbound: data.network.num_outbound,
            inbound: data.network.num_inbound,
          },
          state: {
            downloaded: data.state.downloaded,
            downloadSize: data.state.download_size,
            processingStatus: data.state.processing_status,
          },
        };
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async resyncNode(): Promise<boolean> {
    return await this.makeRESTRequest(
      this.getRequestURL("resync_blockchain"),
      "post"
    )
      .then(() => true)
      .catch(() => false);
  }

  async shutdownNode(): Promise<boolean> {
    return await this.makeRESTRequest(this.getRequestURL("shutdown"), "post")
      .then(() => true)
      .catch(() => false);
  }

  async getConnectedPeers(): Promise<IPeer[]> {
    return await this.makeRESTRequest(
      this.getRequestURL("connected_peers"),
      "get"
    )
      .then((response) => {
        if (!response) return [];
        if (!JSON.parse(response)) return [];
        const peers: {
          address: string;
          agent: string;
          direction: string;
        }[] = JSON.parse(response).map(
          (peer: { addr: string; user_agent: string; direction: string }) => {
            return {
              address: peer.addr,
              agent: peer.user_agent,
              direction: peer.direction,
            };
          }
        );
        return peers;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
