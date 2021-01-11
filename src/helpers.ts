import { useEffect, useRef } from "react";

import { ISeed } from "./interfaces/ISeed";
import { Intent } from "@blueprintjs/core";
import { formatDistanceToNow } from "date-fns";
import { wordlist } from "./seed";

export const getPercentage = function (
  numerator?: number,
  denominator?: number
) {
  if (!numerator || !denominator) return 0;
  if (denominator <= 0) {
    return 0;
  } else {
    const result = Math.round(100 * (numerator / denominator));
    return result < 100 ? result : 99;
  }
};

export const getBlockPercentage = function (
  blockHeight?: number,
  headerHeight?: number
) {
  if (!blockHeight || !headerHeight) return 0;
  if (headerHeight < 10080 || blockHeight < 10080) {
    return getPercentage(blockHeight, headerHeight);
  }
  if (headerHeight - blockHeight > 10080) {
    return 0;
  }

  let remaining = getPercentage(headerHeight - blockHeight, 10080);
  if (remaining <= 0) {
    remaining = 1;
  }

  return 100 - remaining;
};

export const getStateText = function (
  state: string,
  headerHeight?: number,
  networkHeight?: number,
  blockHeight?: number,
  downloaded?: number,
  totalSize?: number,
  processed?: number
): string {
  if (!state) return "Not Connected";
  switch (state) {
    case "FULLY_SYNCED":
      return "Running";
    case "SYNCING_HEADERS":
      return `1/4 Syncing Headers (${getPercentage(
        headerHeight,
        networkHeight
      )}%)`;
    case "SYNCING_BLOCKS":
      return `4/4 Syncing Blocks (${getBlockPercentage(
        blockHeight,
        headerHeight
      )}%)`;
    case "DOWNLOADING_TXHASHSET":
      return `2/4 Downloading State (${getPercentage(downloaded, totalSize)}%)`;
    case "PROCESSING_TXHASHSET":
      return `3/4 Validating State (${processed}%)`;
    case "NOT_CONNECTED":
      return "Waiting for Peers";
    default:
      return "Not Connected";
  }
};

export const getStateColor = function (state: string): string {
  if (!state) return Intent.DANGER;
  if (state.startsWith("SYNCING") || state.endsWith("TXHASHSET")) {
    return Intent.WARNING;
  } else if (state === "FULLY_SYNCED") {
    return Intent.SUCCESS;
  }
  return Intent.WARNING;
};

export const generateEmptySeed = function (length: number = 24): ISeed[] {
  const seed = new Array<ISeed>();
  let i = 1;
  do {
    seed.push({
      position: i++,
      text: "",
      disabled: false,
      valid: true,
    });
  } while (i <= length);
  return seed;
};

export const getSeedWords = function (seed: ISeed[]): string {
  let words: string = "";
  seed.forEach((element) => {
    if (element.text.length > 0) {
      words = words + " " + element.text;
    }
  });
  return words.trim();
};

export const hideSeedWords = function (payload: {
  seed: ISeed[];
  words: number;
}): ISeed[] {
  let newSeed: ISeed[] = [...payload.seed];
  let selectedWords: string[] = [];
  do {
    let word = { ...newSeed[Math.floor(Math.random() * newSeed.length)] };
    if (word.text === "") continue;
    if (selectedWords.find((selected) => selected === word.text)) break;
    selectedWords.push(word.text);
    word.text = "";
    word.disabled = false;
    newSeed[word.position - 1] = word;
  } while (selectedWords.length < payload.words);
  return newSeed;
};

export const getDateAsString = function (date: Date): string {
  return formatDistanceToNow(date, { includeSeconds: true, addSuffix: true });
};

export const getTxIcon = function (type: string): any {
  if (type.indexOf("sent") > -1) {
    return "arrow-top-right";
  } else if (type.indexOf("received") > -1 || type.indexOf("coinbase") > -1) {
    return "arrow-bottom-left";
  } else if (type.indexOf("canceled") > -1) {
    return "cross";
  } else if (type.indexOf("sending") > -1) {
    return "arrow-right";
  } else if (type.indexOf("receiving") > -1) {
    return "arrow-left";
  }
  return "dot";
};

export const getTxIntent = function (type: string): any {
  if (type.indexOf("sent") > -1) {
    return Intent.PRIMARY;
  } else if (type.indexOf("received") > -1 || type.indexOf("coinbase") > -1) {
    return Intent.SUCCESS;
  } else if (type.indexOf("canceled") > -1) {
    return Intent.DANGER;
  } else if (type.indexOf("sending") > -1) {
    return Intent.NONE;
  } else if (type.indexOf("receiving") > -1) {
    return Intent.NONE;
  }
  return Intent.NONE;
};

export const cleanTxType = function (type: string): string {
  return type
    .toLowerCase()
    .split(" ")
    .join("_")
    .split("(")
    .join("")
    .split(")")
    .join("");
};

export const useInterval = function (
  callback: any,
  delay: number,
  deps: any[]
) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      tick(); // Call once first, so no delay
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};

export const cutAddress = (address: string): string => {
  let clean =
    address.substring(-1) === "/"
      ? address.substring(0, address.length - 1)
      : address;
  clean = clean
    .replace("https://", "")
    .replace("http://", "")
    .replace("/", "")
    .replace(".grinplusplus.com", "");

  if (clean.length === 56) {
    const v3 = "[a-z2-7]{56}";
    if (new RegExp(`${v3}`).test(clean)) {
      return clean.substr(0, 20) + "..." + clean.substr(36);
    }
  }

  if (clean.length > 42) {
    clean = clean.substr(0, 38) + "...";
  }

  return clean;
};

export const getResourcePath = (relativePath: string): string => {
  const electron = require("electron");
  const app = electron.app || electron.remote.app;
  if (app.isPackaged) {
    return require("path").join(__dirname, relativePath);
  } else {
    return relativePath;
  }
};

export const isValidSeedWord = (word: string): boolean => {
  return wordlist.includes(word);
};
