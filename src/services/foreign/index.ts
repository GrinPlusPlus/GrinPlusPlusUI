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
        params: [slate, null, ""],
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
          resolve(JSON.parse(body).result.Ok);
        } catch (error) {
          reject(`Service Unavailable ` + body);
        }
      });
    });
  }
}
