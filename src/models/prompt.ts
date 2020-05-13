import { Action, action } from "easy-peasy";

export interface PasswordPromptModel {
  username: string | undefined;
  password: string | undefined;
  waitingResponse: boolean;
  setUsername: Action<PasswordPromptModel, string | undefined>;
  setPassword: Action<PasswordPromptModel, string | undefined>;
  setWaitingResponse: Action<PasswordPromptModel, boolean>;
}

const prompt: PasswordPromptModel = {
  username: undefined,
  password: undefined,
  waitingResponse: false,
  setUsername: action((state, username) => {
    state.username = username;
  }),
  setPassword: action((state, password) => {
    state.password = password;
  }),
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
};

export default prompt;
