export interface INodeStatus {
  headerHeight: number;
  status: string;
  agent: string;
  headers: number;
  blocks: number;
  network: { height: number; outbound: number; inbound: number };
  state: {
    downloaded: number;
    downloadSize: number;
    processingStatus: number;
  };
}
