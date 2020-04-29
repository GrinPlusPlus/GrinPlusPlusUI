import { Intent } from "@blueprintjs/core";
import { ISeed } from "./interfaces/ISeed";
import { useEffect, useRef } from "react";

export const getPercentage = function(
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

export const getBlockPercentage = function(
  blockHeight?: number,
  headerHeight?: number
) {
  if (!blockHeight || !headerHeight) return 0;
  if (headerHeight < 2880 || blockHeight < 2880) {
    return getPercentage(blockHeight, headerHeight);
  }
  if (headerHeight - blockHeight > 2880) {
    return 0;
  }

  let remaining = getPercentage(headerHeight - blockHeight, 2880);
  if (remaining <= 0) {
    remaining = 1;
  }

  return 100 - remaining;
};

export const getStateText = function(
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

export const getStateColor = function(state: string): string {
  if (!state) return Intent.DANGER;
  if (state.startsWith("SYNCING") || state.endsWith("TXHASHSET")) {
    return Intent.WARNING;
  } else if (state === "FULLY_SYNCED") {
    return Intent.SUCCESS;
  }
  return Intent.DANGER;
};

export const generateEmptySeed = function(): ISeed[] {
  const seed = new Array<ISeed>();
  let i = 1;
  do {
    seed.push({
      position: i++,
      text: "",
      disabled: false,
    });
  } while (i <= 24);
  return seed;
};

export const getSeedWords = function(seed: ISeed[]): string {
  let words: string = "";
  seed.forEach((element) => {
    if (element.text.length > 0) {
      words = words + " " + element.text;
    }
  });
  return words.trim();
};

export const hideSeedWords = function(payload: {
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

export const getDateAsString = function(date: Date): string {
  return (
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    "_" +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2)
  );
};

export const getTxIcon = function(type: string): any {
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

export const getTxIntent = function(type: string): any {
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

export const cleanTxType = function(type: string): string {
  return type
    .toLowerCase()
    .split(" ")
    .join("_")
    .split("(")
    .join("")
    .split(")")
    .join("");
};

export const useInterval = function(callback: any, delay: number) {
  const savedCallback = useRef(callback);

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
