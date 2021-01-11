import { generateEmptySeed, getSeedWords, hideSeedWords } from "./helpers";

import { ISeed } from "./interfaces/ISeed";

describe("Helpers", () => {
  test("generateEmptySeed", () => {
    const emptySeed = generateEmptySeed();
    emptySeed.forEach((word) => {
      expect(word.disabled).toBe(false);
      expect(word.text).toBe("");
    });
    expect(
      getSeedWords([
        { position: 1, text: "word1", disabled: false },
        { position: 2, text: "word2", disabled: false },
        { position: 3, text: "word3", disabled: false },
      ])
    ).toBe("word1 word2 word3");
  });
  test("hideSeedWords", () => {
    let seed: ISeed[] = [];
    for (let i = 1; i <= 24; i++) {
      let word =
        Math.random().toString(20).substring(2, 15) +
        Math.random().toString(20).substring(2, 15);
      seed.push({ text: word, position: i, disabled: true });
    }
    const words = 5;
    let hiddenWords = 0;
    const hiddenSeed = hideSeedWords({ seed: seed, words: words });
    hiddenSeed.forEach((element) => {
      if (element.text === "" && element.disabled === false) hiddenWords++;
    });
    expect(hiddenWords).toBe(words);
  });
});
