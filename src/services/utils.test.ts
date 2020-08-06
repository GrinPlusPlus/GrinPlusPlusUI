import {
  formatGrinAmount,
  getFileExtension,
  validateAddress,
  validateExtension,
  validateUrl
} from "./utils";

describe("Utils", () => {
  test("formatGrinAmount()", () => {
    expect(formatGrinAmount(10)).toBe(0.00000001);
    expect(formatGrinAmount(20)).toBe(0.00000002);
  });
  test("getFileExtension()", () => {
    expect(getFileExtension("0001.tx")).toBe("tx");
    expect(getFileExtension("0001.response")).toBe("response");
  });
  test("validateExtension()", () => {
    expect(validateExtension("0001.response", "response")).toBe(true);
    expect(validateExtension("0001.response", "tx")).toBe(false);
  });
  test("validateUrl()", () => {
    expect(validateUrl("http://duckduckgo.com")).toBe(true);
    expect(validateUrl("https://duckduckgo.com")).toBe(true);
    expect(validateUrl("http://duckduckgo.com/")).toBe(true);
    expect(validateUrl("https://duckduckgo.com/")).toBe(true);
    expect(validateUrl("http://duckduckgo:80")).toBe(false);
    expect(validateUrl("http://duckduckgo.com:80")).toBe(true);
    expect(validateUrl("https://duckduckgo.com:5000/")).toBe(true);
  });
  test("validateAddress()", () => {
    expect(
      validateAddress(
        "http://jamie22ezawwi5r3o7lrgsno43jj7vq5en74czuw6wfmjzkhjjryxnid.onion.com"
      )
    ).toBe("http");
    expect(
      validateAddress(
        "http://jamie22ezawwi5r3o7lrgsno43jj7vq5en74czuw6wfmjzkhjjryxnid.onion.com/"
      )
    ).toBe("http");
    expect(validateAddress("thisisnotavalidurl")).toBe(false);
    expect(validateAddress("http://duckduckgo.com")).toBe("http");
  });
});
