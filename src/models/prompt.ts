import { Action, action } from "easy-peasy";

export interface PasswordPromptModel {
  username: string;
  password: string;
  waitingResponse: boolean;
  setUsername: Action<PasswordPromptModel, string>;
  setPassword: Action<PasswordPromptModel, string>;
  setWaitingResponse: Action<PasswordPromptModel, boolean>;
}

const prompt: PasswordPromptModel = {
  username: "",
  password: "",
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
