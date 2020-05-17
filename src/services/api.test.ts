import { getCommand, getConfigFilePath, getNodeDataPath } from "./node";

import { BaseApi } from "./api";
import { NodeAPI } from "./node/rest";
import { OwnerAPI } from "./owner/rest";
import { OwnerRPCApi } from "./owner/rpc";

class TestBasiApi extends BaseApi {}
class TestOwnerRPCApi extends OwnerRPCApi {}
class TestOwnerAPI extends OwnerAPI {}
class TestNodeAPI extends NodeAPI {}

export const _getCommand = function(): string {
  const { remote } = require("electron");
  const cmd = (() => {
    switch (remote.process.platform) {
      case "win32":
        return "GrinNode.exe";
      case "darwin":
        return "GrinNode";
      case "linux":
        return "GrinNode";
      default:
        return "";
    }
  })();
  return cmd;
};

describe("APIs", () => {
  test("constructor", () => {
    const test = new TestBasiApi();
    expect(test.floonet).toBe(true);
    expect(test.protocol).toBe("http");
    expect(test.ip).toBe("127.0.0.1");
    expect(test.mode).toBe("DEV");
  });
  test("isMainnet()", () => {
    const falseTest = new TestBasiApi();
    expect(falseTest.isMainnet()).toBe(false);
    const trueTest = new TestBasiApi(false);
    expect(trueTest.isMainnet()).toBe(true);
  });
  test("NodeAPI", () => {
    const nodeAPIdev = new TestNodeAPI();
    let expectedValue = "http://127.0.0.1:13413/v1";
    expect(nodeAPIdev.url).toBe(expectedValue);

    const nodeAPIprod = new TestNodeAPI(false, "http", "127.0.0.1", "PROD");
    expectedValue = "http://127.0.0.1:3413/v1";
    expect(nodeAPIprod.url).toBe(expectedValue);
  });
  test("OwnerAPI", () => {
    const nodeAPIdev = new TestOwnerAPI();
    let expectedValue = "http://127.0.0.1:13420/v1/wallet/owner";
    expect(nodeAPIdev.url).toBe(expectedValue);

    const nodeAPIprod = new TestOwnerAPI(false, "http", "127.0.0.1", "PROD");
    expectedValue = "http://127.0.0.1:3420/v1/wallet/owner";
    expect(nodeAPIprod.url).toBe(expectedValue);
  });
  test("OwnerRPCApi", () => {
    const nodeAPIdev = new TestOwnerRPCApi();
    let expectedValue = "http://127.0.0.1:3421/v2";
    expect(nodeAPIdev.url).toBe(expectedValue);

    const nodeAPIprod = new TestOwnerRPCApi(false, "http", "127.0.0.1", "PROD");
    expectedValue = "http://127.0.0.1:3421/v2";
    expect(nodeAPIprod.url).toBe(expectedValue);
  });
  test("getNodeDataPath()", () => {
    expect(getNodeDataPath()).toBe("/.GrinPP/MAINNET");
    expect(getNodeDataPath(true)).toBe("/.GrinPP/FLOONET");
  });
  test("getNodeDataPath()", () => {
    expect(getConfigFilePath()).toBe("/.GrinPP/MAINNET/server_config.json");
    expect(getConfigFilePath(true)).toBe("/.GrinPP/FLOONET/server_config.json");
  });
  test("getCommand()", () => {
    expect(getCommand()).toBe(_getCommand());
  });
});
