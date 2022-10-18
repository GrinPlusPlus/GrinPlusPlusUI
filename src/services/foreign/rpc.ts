import { v4 as uuidv4 } from "uuid";

export const ConfigNode = (
  values?: {
    max_peers?: number;
    min_peers?: number;
    min_confirmations?: number;
    reuse_address?: number;
    preferred_peers?: string[];
    allowed_peers?: string[];
    blocked_peers?: string[];
  }
): Promise<{
  max_peers: number;
  min_peers: number;
  min_confirmations: number;
  reuse_address: boolean;
  preferred_peers: string[];
  allowed_peers: string[];
  blocked_peers: string[];
} | null> => {
  const request = window.require("request");
  const method: string = values === undefined ? "get_config" : "update_config";
  const params = values === undefined ? [] : values;

  const options = {
    timeout: 60000,
    url: `http://127.0.0.1:3413/v2/foreign`,
    method: "post",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: uuidv4(),
      method: method,
      params: params,
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
        resolve(JSON.parse(body).result);
      } catch (error) {
        reject(`Service Unavailable ` + body);
      }
    });
  });
};
