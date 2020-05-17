import { FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import React, { useCallback } from "react";

import { Flex } from "../styled";
import { ISeed } from "../../interfaces/ISeed";

type WalletSeedInputComponentTrops = {
  seed: ISeed[];
  onWordChangeCb: (word: string, position: number) => void;
  length: number;
};

export const WalletSeedInputComponent = ({
  seed,
  onWordChangeCb,
  length
}: WalletSeedInputComponentTrops) => {
  const walletSeedTable = useCallback(() => {
    let table = [];

    for (let i = 0; i < length / 3; i++) {
      table.push(
        <Flex key={`group-${i}-w`}>
          {seed.slice(i * 3, (i + 1) * 3).map(word => (
            <FormGroup
              key={`word-${i}-${word.position}`}
              style={{ margin: "0px 2px 2px 2px" }}
            >
              <InputGroup
                style={{
                  backgroundColor: word.valid ? "#21242D" : "#ff1919",
                  color: "white"
                }}
                id={`${word.position}`}
                key={`word-${word.position}`}
                value={word.text}
                disabled={word.disabled}
                className="bp3-dark"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onWordChangeCb(e.target.value, +e.target.id)
                }
                rightElement={
                  <Tag
                    className="bp3-dark"
                    style={{
                      fontFamily: "Verdana",
                      fontSize: "11px",
                      color: "gray"
                    }}
                  >
                    {`${word.position}`.padStart(2, "0")}
                  </Tag>
                }
              />
            </FormGroup>
          ))}
        </Flex>
      );
    }
    return table;
  }, [seed, onWordChangeCb, length]);

  return <div className="bp3-dark">{walletSeedTable()}</div>;
};
