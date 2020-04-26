import React from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';

type TransactionMessageProps = {
  message: string;
  setMessageCb: (message: string) => void;
};

export default function TransactionMessageComponent({
  message,
  setMessageCb,
}: TransactionMessageProps) {
  return (
    <FormGroup helperText="This message is optional.">
      <InputGroup
        value={message}
        placeholder="Message"
        className="bp3-dark"
        style={{ backgroundColor: "#21242D" }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessageCb(e.target.value)
        }
      />
    </FormGroup>
  );
}
