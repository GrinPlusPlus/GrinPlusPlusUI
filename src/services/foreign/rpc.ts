import { v4 as uuidv4 } from "uuid";

export class RPC {
  public static async check(address: string): Promise<boolean> {
    const request = window.require("request");
    let options = {
      timeout: 10000,
      url: `${address}/v2/foreign`,
      method: "post",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: uuidv4(),
        method: "check_version",
      }),
    };
    return new Promise((resolve, reject) => {
      request(options, (error: any, response: any, body: string) => {
        try {
          if (error) reject(error);
          if (response === null || response === undefined)
            reject(`Service Unavailable ` + body);
          if (response.statusCode !== 200) {
            reject("Invalid status code <" + response.statusCode + ">");
          }
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      });
    });
  }

  public static async receive(address: string, slate: {}): Promise<{}> {
    const request = window.require("request");
    let options = {
      timeout: 60000,
      url: `${address}/v2/foreign`,
      method: "post",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: uuidv4(),
        method: "receive_tx",
        params: [slate, null, null],
      }),
    };
    require("electron-log").info("Foreign receive request: \n" + options.body);
    return new Promise((resolve, reject) => {
      request(options, (error: any, response: any, body: string) => {
        require("electron-log").info("Foreign receive response: \n" + body);
        try {
          if (error) reject(error);
          if (response === null || response === undefined)
            reject(`Service Unavailable ` + body);
          if (response.statusCode !== 200) {
            reject("Invalid status code <" + response.statusCode + ">");
          }
          resolve(JSON.parse(body).result.Ok);
        } catch (error) {
          reject(`Service Unavailable ` + body);
        }
      });
    });
  }

  public static async finalize(address: string, slate: {}): Promise<{}> {
    const request = window.require("request");
    let options = {
      timeout: 60000,
      url: `${address}/v2/foreign`,
      method: "post",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: uuidv4(),
        method: "finalize_tx",
        params: [slate],
      }),
    };
    require("electron-log").info("Foreign finalize request: \n" + options.body);
    return new Promise((resolve, reject) => {
      request(options, (error: any, response: any, body: string) => {
        require("electron-log").info("Foreign finalize response: \n" + body);
        try {
          if (error) reject(error);
          if (response === null || response === undefined)
            reject(`Service Unavailable ` + body);
          if (response.statusCode !== 200) {
            reject("Invalid status code <" + response.statusCode + ">");
          }
          resolve(JSON.parse(body).result.Ok);
        } catch (error) {
          reject(`Service Unavailable ` + body);
        }
      });
    });
  }

  public static async config(values?: {
    max_peers?: number;
    min_peers?: number;
    min_confirmations?: number;
  }): Promise<{
    max_peers: number;
    min_confirmations: number;
    min_peers: number;
  } | null> {
    const request = window.require("request");
    let method: string = values === undefined ? "get_config" : "update_config";
    let params = values === undefined ? [] : values;

    let options = {
      timeout: 60000,
      url: "http://localhost:3413/v2/foreign",
      method: "post",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: uuidv4(),
        method: method,
        params: params,
      }),
    };

    require("electron-log").info(`Callling ${method}...`);
    return new Promise((resolve, reject) => {
      request(options, (error: any, response: any, body: string) => {
        try {
          if (error) reject(error);
          if (response === null || response === undefined)
            reject(`Service Unavailable ` + body);
          if (response.statusCode !== 200) {
            reject("Invalid status code <" + response.statusCode + ">");
          }
          resolve(JSON.parse(body).result);
        } catch (error) {
          reject(`Service Unavailable ` + body);
        }
      });
    });
  }
}
