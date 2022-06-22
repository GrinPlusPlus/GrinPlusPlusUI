import {
  Action,
  Computed,
  Thunk,
  ThunkOn,
  action,
  computed,
  thunk,
  thunkOn,
} from "easy-peasy";

import { Injections } from "../../store";
import { StoreModel } from "..";
import { validateAddress } from "../../services/utils";

export interface SendCoinsModel {
  amount: string | undefined;
  inputs: string[];
  outputs: string[];
  inputsTable: {
    amount: number;
    block_height: number;
    commitment: string;
    keychain_path: string;
    status: string;
    transaction_id: number;
  }[];
  fee: number;
  address: string;
  message: string;
  strategy: string;
  error: string;
  waitingResponse: boolean;
  returnedSlatepack: string;
  slatepackMessageToFinalize: string;
  setSlatepackMessageToFinalize: Action<SendCoinsModel, string>;
  setReturnedSlatepack: Action<SendCoinsModel, string>;
  setError: Action<SendCoinsModel, string>;
  setStrategy: Action<SendCoinsModel, string>;
  addCustomInput: Action<SendCoinsModel, string>;
  removeCustomInput: Action<SendCoinsModel, string>;
  setAmount: Action<SendCoinsModel, string>;
  setEstimatedFee: Action<SendCoinsModel, number>;
  setWaitingResponse: Action<SendCoinsModel, boolean>;
  setInputsTable: Action<
    SendCoinsModel,
    {
      amount: number;
      block_height: number;
      commitment: string;
      keychain_path: string;
      status: string;
      transaction_id: number;
    }[]
  >;
  setInputs: Action<
    SendCoinsModel,
    {
      amount: number;
      block_height: number;
      commitment: string;
      keychain_path: string;
      status: string;
      transaction_id: number;
    }[]
  >;
  setMessage: Action<SendCoinsModel, string>;
  setAddress: Action<SendCoinsModel, string>;
  fillInputs: Action<SendCoinsModel, string[]>;
  fillOutputs: Action<SendCoinsModel, string[]>;
  setInitialValues: Thunk<SendCoinsModel, undefined, Injections, StoreModel>;
  getOutputs: Thunk<SendCoinsModel, string, Injections, StoreModel>;
  estimateFee: Thunk<
    SendCoinsModel,
    {
      amount: string | undefined;
      strategy: string;
      token: string;
      message: string;
      inputs: string[];
    },
    Injections,
    StoreModel
  >;
  sendGrins: Thunk<
    SendCoinsModel,
    {
      amount: string | undefined;
      address: string;
      message: string;
      method: string;
      inputs: string[];
      grinJoinAddress: string;
      token: string;
      strategy: string;
    },
    Injections,
    StoreModel
  >;
  onStrategyChanged: ThunkOn<SendCoinsModel, Injections, StoreModel>;
  onCustomInputsChanged: ThunkOn<SendCoinsModel, Injections, StoreModel>;
  isAddressValid: Computed<SendCoinsModel, boolean>;
}

const sendCoinsModel: SendCoinsModel = {
  amount: undefined,
  fee: 0,
  inputs: [],
  outputs: [],
  inputsTable: [],
  address: "",
  message: "",
  strategy: "SMALLEST",
  error: "",
  waitingResponse: false,
  returnedSlatepack: "",
  slatepackMessageToFinalize: "",
  setSlatepackMessageToFinalize: action((state, slatepack) => {
    state.slatepackMessageToFinalize = slatepack;
  }),
  setReturnedSlatepack: action((state, slatepack) => {
    state.returnedSlatepack = slatepack;
  }),
  setError: action((state, error) => {
    state.error = error;
  }),
  setStrategy: action((state, strategy) => {
    state.strategy = strategy;
  }),
  setInitialValues: thunk(
    (actions, payload, { getStoreActions, getStoreState }) => {
      getStoreState().sendCoinsModel.amount = undefined;
      getStoreState().sendCoinsModel.fee = 0;
      getStoreState().sendCoinsModel.strategy = "SMALLEST";
      getStoreState().sendCoinsModel.address = "";
      getStoreState().sendCoinsModel.message = "";
      getStoreState().sendCoinsModel.inputs = [];
      getStoreState().sendCoinsModel.outputs = [];
      getStoreState().sendCoinsModel.inputsTable = [];
      getStoreActions().passwordPrompt.setUsername(undefined);
      getStoreActions().passwordPrompt.setPassword(undefined);
    }
  ),
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
  addCustomInput: action((state, commitment) => {
    for (let index = 0; index < state.inputs.length; index++) {
      const input = state.inputs[index];
      if (input === commitment) {
        return;
      }
    }
    const newInputs = [...state.inputs];
    newInputs.push(commitment);
    state.inputs = newInputs;
  }),
  removeCustomInput: action((state, commitment) => {
    const newInputs = [...state.inputs];
    const index = newInputs.indexOf(commitment);
    if (index > -1) {
      newInputs.splice(index, 1);
    }
    state.inputs = newInputs;
  }),
  setAmount: action((state, amount) => {
    state.amount = amount;
  }),
  setEstimatedFee: action((state, fee) => {
    if (state.fee === fee) return;
    state.fee = fee;
  }),
  setInputsTable: action((state, inputs) => {
    if (inputs.length === 0) return;
    const table: {
      amount: number;
      block_height: number;
      commitment: string;
      keychain_path: string;
      status: string;
      transaction_id: number;
    }[] = [];

    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      if (element.status.toLowerCase() === "spendable") {
        table.push(element);
      }
    }

    state.inputsTable = table;
  }),
  setInputs: action((state, inputs) => {
    if (inputs.length === 0) return;
    const table: string[] = [];

    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      table.push(element.commitment);
    }

    state.inputs = table;
  }),
  setMessage: action((state, message) => {
    state.message = message;
  }),
  setAddress: action((state, address) => {
    state.address = address;
  }),
  fillInputs: action((state, inputs) => {
    state.inputs = [];
    state.inputs = inputs;
  }),
  fillOutputs: action((state, outputs) => {
    state.outputs = [];
    state.outputs = outputs;
  }),
  getOutputs: thunk(async (actions, token, { injections, getStoreState }) => {
    const { ownerService } = injections;
    const apiSettings = getStoreState().settings.defaultSettings;
    return await new ownerService.RPC(
      apiSettings.floonet,
      apiSettings.protocol,
      apiSettings.ip
    )
      .getOutputs(token)
      .then((response) => {
        if (typeof response === "string") {
          throw new Error(response);
        }
        actions.setInputsTable(response);
        const commitments: string[] = [];
        response.forEach((input) => {
          if (input.status.toLowerCase() === "spendable") {
            commitments.push(input.commitment);
          }
        });
        actions.fillInputs(commitments);
        actions.fillOutputs(commitments);
      });
  }),
  estimateFee: thunk(
    async (
      actions,
      payload,
      { injections, getStoreActions, getStoreState }
    ) => {
      const { ownerService, utilsService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      )
        .estimateFee(
          payload.token,
          payload.amount,
          payload.strategy,
          payload.inputs,
          payload.message
        )
        .then((response) => {
          const commitments: string[] = [];
          response.inputs.forEach((input) => {
            commitments.push(input.commitment);
          });
          actions.fillInputs(commitments);
          getStoreActions().sendCoinsModel.setEstimatedFee(
            utilsService.formatGrinAmount(response.fee)
          );
          // User is trying to send the max...
          if (payload.amount === undefined) {
            getStoreActions().sendCoinsModel.setAmount(
              utilsService.formatGrinAmount(response.amount).toString()
            );
          }
        });
    }
  ),
  sendGrins: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ): Promise<string> => {
      const { ownerService } = injections;
      const defaultSettings = getStoreState().settings.defaultSettings;

      const destinationAddress = payload.address.replace(/\/?$/, ""); //removing trailing /

      const response = await new ownerService.RPC(
        defaultSettings.floonet,
        defaultSettings.protocol,
        defaultSettings.ip
      ).sendCoins(
        payload.token,
        payload.amount,
        payload.message,
        payload.strategy,
        payload.inputs,
        payload.method,
        payload.grinJoinAddress,
        destinationAddress
      );
      if (typeof response === "string") {
        return response;
      }

      actions.setInitialValues(); // alles gut!

      if (response.status === "SENT") {
        actions.setReturnedSlatepack(response.slatepack);
        return "SENT";
      } else {
        return "FINALIZED";
      }
    }
  ),
  onStrategyChanged: thunkOn(
    (actions, storeActions) => [storeActions.sendCoinsModel.setStrategy],
    async (actions, target, { getStoreState }) => {
      if (getStoreState().sendCoinsModel.amount) {
        await actions
          .estimateFee({
            amount: getStoreState().sendCoinsModel.amount,
            strategy: getStoreState().sendCoinsModel.strategy,
            message: getStoreState().sendCoinsModel.message,
            token: getStoreState().session.token,
            inputs: getStoreState().sendCoinsModel.inputs,
          })
          .catch((error: { message: string; }) => {
            actions.setError(error.message);
          });
      }
    }
  ),
  onCustomInputsChanged: thunkOn(
    (actions, storeActions) => [
      storeActions.sendCoinsModel.addCustomInput,
      storeActions.sendCoinsModel.removeCustomInput,
    ],
    async (actions, target, { getStoreState }) => {
      if (getStoreState().sendCoinsModel.amount) {
        await actions
          .estimateFee({
            amount: getStoreState().sendCoinsModel.amount,
            strategy: getStoreState().sendCoinsModel.strategy,
            message: getStoreState().sendCoinsModel.message,
            token: getStoreState().session.token,
            inputs: getStoreState().sendCoinsModel.inputs,
          })
          .catch((error: { message: string; }) => {
            actions.setError(error.message);
          });
      }
    }
  ),
  isAddressValid: computed((state) => {
    if (validateAddress(state.address) === false) return false;
    return true;
  }),
};

export default sendCoinsModel;
