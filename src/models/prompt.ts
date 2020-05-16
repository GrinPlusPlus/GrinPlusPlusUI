import { Action, action } from "easy-peasy";

export interface PasswordPromptModel {
  username: string | undefined;
  password: string | undefined;
  callback?: () => Promise<void>;
  waitingResponse: boolean;
  setUsername: Action<PasswordPromptModel, string | undefined>;
  setPassword: Action<PasswordPromptModel, string | undefined>;
  setCallback: Action<PasswordPromptModel, () => Promise<void>>;
  setWaitingResponse: Action<PasswordPromptModel, boolean>;
}

const prompt: PasswordPromptModel = {
  username: undefined,
  password: undefined,
  callback: undefined,
  waitingResponse: false,
  setUsername: action((state, username) => {
    state.username = username;
  }),
  setPassword: action((state, password) => {
    state.password = password;
  }),
  setCallback: action((state, cb) => {
    state.callback = cb;
  }),
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
};

export default prompt;
