import { v4 as uuidv4 } from "uuid";

export class BaseApi {
  protocol: string = "http";
  ip: string = "127.0.0.1";
  floonet: boolean = false;
  ports: {
    node: number;
    foreignRPC: number;
    owner: number;
    ownerRPC: number;
  } = { node: 3413, foreignRPC: 3415, owner: 3420, ownerRPC: 3421 };

  constructor(
    floonet: boolean = true,
    protocol: string = "http",
    ip: string = "127.0.0.1"
  ) {
    this.protocol = protocol;
    this.ip = ip;
    this.floonet = floonet;
  }

  isMainnet(): boolean {
    return !this.floonet;
  }

  private getPort(port: number): number {
    return this.isMainnet() ? port : 10000 + port;
  }

  protected getURL(api: "node" | "foreignRPC" | "owner" | "ownerRPC"): string {
    let port = -1;
    let version = "";
    switch (api) {
      case "node":
        port = this.getPort(this.ports.node);
        version = "v1";
        break;
      case "foreignRPC":
        port = this.getPort(this.ports.foreignRPC);
        version = "v1/wallet/foreign";
        break;
      case "owner":
        port = this.getPort(this.ports.owner);
        version = "v1/wallet/owner";
        break;
      case "ownerRPC":
        port = this.ports.ownerRPC;
        version = "v2";
        break;
    }
    return `${this.protocol}://${this.ip}:${port}/${version}`;
  }

  private getNodeURL(): string {
    return this.getURL("node");
  }

  private getOwnerRPCURL(): string {
    return this.getURL("ownerRPC");
  }

  protected getRequestURL(
    call:
      | "shutdown"
      | "node_status"
      | "resync_blockchain"
      | "connected_peers"
      | "list_wallets"
      | "receive"
      | "send"
      | "finalize"
      | "get_address"
      | "get_balance"
      | "login"
      | "logout"
      | "create_wallet"
      | "restore_wallet"
      | "wallet_summary"
      | "estimate_fee"
      | "cancel_tx"
      | "repost_tx"
      | "list_outputs"
      | "get_seed"
      | "list_txs"
      | "delete_wallet"
      | "scan_for_outputs"
  ): string {
    switch (call) {
      case "node_status":
        return `${this.getNodeURL()}/status`;
      case "resync_blockchain":
        return `${this.getNodeURL()}/resync`;
      case "connected_peers":
        return `${this.getNodeURL()}/peers/connected`;
      case "list_wallets":
        return this.getOwnerRPCURL();
      case "shutdown":
        return `${this.getNodeURL()}/shutdown`;
      case "send":
        return this.getOwnerRPCURL();
      case "finalize":
        return this.getOwnerRPCURL();
      case "receive":
        return this.getOwnerRPCURL();
      case "get_address":
        return this.getOwnerRPCURL();
      case "login":
        return this.getOwnerRPCURL();
      case "get_seed":
        return this.getOwnerRPCURL();
      case "list_txs":
        return this.getOwnerRPCURL();
      case "logout":
        return this.getOwnerRPCURL();
      case "get_balance":
        return this.getOwnerRPCURL();
      case "create_wallet":
        return this.getOwnerRPCURL();
      case "restore_wallet":
        return this.getOwnerRPCURL();
      case "delete_wallet":
        return this.getOwnerRPCURL();
      case "estimate_fee":
        return this.getOwnerRPCURL();
      case "cancel_tx":
        return this.getOwnerRPCURL();
      case "repost_tx":
        return this.getOwnerRPCURL();
      case "list_outputs":
        return this.getOwnerRPCURL();
      case "scan_for_outputs":
        return this.getOwnerRPCURL();
      default:
        return "";
    }
  }

  protected async makeRESTRequest(
    url: string,
    method: string,
    headers?: {},
    body?: {}
  ): Promise<string> {
    const _url = new URL(url);
    let options = {
      hostname: _url.hostname,
      port: _url.port,
      path: _url.pathname,
      timeout: 10000,
      pool: { maxSockets: 5 },
      url: url,
      method: method,
      headers: headers,
      agent: false,
      encoding: "utf-8",
      body: JSON.stringify(body),
    };

    if (method.toLowerCase() === "get") {
      return new Promise((resolve, reject) => {
        window
          .require("http")
          .get(url, options, (response: any) => {
            let body = "";
            response.on("data", (chunk: string) => (body += chunk));
            response.on("end", () => resolve(body));
          })
          .on("error", (e: string) => reject(e));
      });
    } else {
      return new Promise((resolve, reject) => {
        window
          .require("request")
          .post(url, options, (error: any, response: any, body: string) => {
            if (error) reject(error);
            else if (body === undefined) reject(error);
            else resolve(body);
          });
      });
    }
  }

  protected async makeRPCRequest(
    url: string,
    method: string,
    params: {} | []
  ): Promise<any> {
    const request = window.require("request");
    let options = {
      timeout: 180000,
      url: url,
      agent: false,
      pool: { maxSockets: 5 },
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: uuidv4(),
        method: method,
        params: params,
      }),
    };
    return new Promise((resolve, reject) => {
      request.post(options, (error: string, response: {}, body: string) => {
        if (error) {
          reject(error);
        } else if (body === undefined) reject(error);
        else resolve(JSON.parse(body));
      });
    });
  }
}
