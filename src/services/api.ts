import { v4 as uuidv4 } from "uuid";

export class BaseApi {
  private _mode: "DEV" | "TEST" | "PROD";
  private _protocol: string;
  private _ip: string;
  private _floonet: boolean;
  private _ports: {
    node: number;
    foreignRPC: number;
    owner: number;
    ownerRPC: number;
  } = { node: 3413, foreignRPC: 3415, owner: 3420, ownerRPC: 3421 };

  constructor(
    floonet: boolean = true,
    protocol: string = "http",
    ip: string = "127.0.0.1",
    mode: "DEV" | "TEST" | "PROD" = "DEV"
  ) {
    this._protocol = protocol;
    this._ip = ip;
    this._floonet = floonet;
    this._mode = mode;
  }

  public get mode() {
    return this._mode;
  }
  public get protocol() {
    return this._protocol;
  }
  public get ip() {
    return this._ip;
  }
  public get floonet() {
    return this._floonet;
  }
  public get ports() {
    return this._ports;
  }

  public isMainnet(): boolean {
    return !this._floonet;
  }

  private _getPort(port: number): number {
    return this.isMainnet() ? port : 10000 + port;
  }

  protected getURL(api: "node" | "foreignRPC" | "owner" | "ownerRPC"): string {
    let port = -1;
    let version = "";
    switch (api) {
      case "node":
        port = this._getPort(this._ports.node);
        version = "v1";
        break;
      case "foreignRPC":
        port = this._getPort(this._ports.foreignRPC);
        version = "v1/wallet/foreign";
        break;
      case "owner":
        port = this._getPort(this._ports.owner);
        version = "v1/wallet/owner";
        break;
      case "ownerRPC":
        port = this._ports.ownerRPC;
        version = "v2";
        break;
    }
    return `${this._protocol}://${this._ip}:${port}/${version}`;
  }

  private _getNodeURL(): string {
    return this.getURL("node");
  }

  private _getForeignRPCURL(): string {
    return this.getURL("foreignRPC");
  }

  private _getOwnerURL(): string {
    return this.getURL("owner");
  }

  private _getOwnerRPCURL(): string {
    return this.getURL("ownerRPC");
  }

  protected getRequestURL(
    call:
      | "shutdown"
      | "node_status"
      | "resync_blockchain"
      | "connected_peers"
      | "accounts"
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
      | "scan_outputs"
      | "estimate_fee"
      | "cancel_tx"
      | "repost_tx"
      | "retrieve_outputs"
      | "get_seed"
      | "list_txs"
      | "delete_wallet"
  ): string {
    switch (call) {
      case "node_status":
        return `${this._getNodeURL()}/status`;
      case "resync_blockchain":
        return `${this._getNodeURL()}/resync`;
      case "connected_peers":
        return `${this._getNodeURL()}/peers/connected`;
      case "accounts":
        return `${this._getOwnerURL()}/accounts`;
      case "shutdown":
        return `${this._getNodeURL()}/shutdown`;
      case "send":
        return this._getOwnerRPCURL();
      case "finalize":
        return this._getOwnerRPCURL();
      case "receive":
        return this._getOwnerRPCURL();
      case "get_address":
        return this._getOwnerRPCURL();
      case "login":
        return this._getOwnerRPCURL();
      case "get_seed":
        return this._getOwnerRPCURL();
      case "list_txs":
        return this._getOwnerRPCURL();
      case "logout":
        return this._getOwnerRPCURL();
      case "get_balance":
        return this._getOwnerRPCURL();
      case "create_wallet":
        return this._getOwnerRPCURL();
      case "restore_wallet":
        return this._getOwnerRPCURL();
      case "delete_wallet":
        return this._getOwnerRPCURL();
      case "estimate_fee":
        return this._getOwnerRPCURL();
      case "cancel_tx":
        return this._getOwnerRPCURL();
      case "repost_tx":
        return this._getOwnerRPCURL();
      case "scan_outputs":
        return `${this._getOwnerURL()}/update_wallet`;
      case "retrieve_outputs":
        return `${this._getOwnerURL()}/retrieve_outputs`;
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
      body: JSON.stringify(body)
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
      timeout: 60000,
      url: url,
      agent: false,
      pool: { maxSockets: 5 },
      headers: {
        Accept: "application/json, text/plain, */*"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: uuidv4(),
        method: method,
        params: params
      })
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
