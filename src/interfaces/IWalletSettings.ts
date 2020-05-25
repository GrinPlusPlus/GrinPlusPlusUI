export interface IWalletSettings {
  ip: string;
  protocol: "http" | "https";
  mode: "DEV" | "TEST" | "PROD";
  binaryPath: string;
  floonet: boolean;
  minimumPeers: number;
  maximumPeers: number;
  minimumConfirmations: number;
  ports: { node: number; foreignRPC: number; owner: number; ownerRPC: number };
  grinJoinAddress: string;
  grinChckAddress: string;
}
