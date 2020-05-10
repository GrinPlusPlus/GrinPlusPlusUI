import { Injections } from "../../store";
import { StoreModel } from "..";
import { validateAddress } from "../../services/utils";
import {
  Action,
  action,
  Computed,
  computed,
  Thunk,
  thunk,
  ThunkOn,
  thunkOn,
} from "easy-peasy";

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
      amount: number;
      strategy: string;
      token: string;
      message: string;
      inputs: string[];
    },
    Injections,
    StoreModel
  >;
  sendViaFile: Thunk<
    SendCoinsModel,
    {
      amount: number;
      strategy: string;
      inputs: string[];
      message: string;
      token: string;
    },
    Injections,
    StoreModel
  >;
  sendUsingListener: Thunk<
    SendCoinsModel,
    {
      amount: number;
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
  setError: action((state, error) => {
    state.error = error;
  }),
  setStrategy: action((state, strategy) => {
    state.strategy = strategy;
  }),
  setInitialValues: thunk(
    (actions, payload, { injections, getStoreActions, getStoreState }) => {
      getStoreState().sendCoinsModel.amount = undefined;
      getStoreState().sendCoinsModel.fee = 0;
      getStoreState().sendCoinsModel.strategy = "SMALLEST";
      getStoreState().sendCoinsModel.address = "";
      getStoreState().sendCoinsModel.message = "";
      getStoreState().sendCoinsModel.inputs = [];
      getStoreState().sendCoinsModel.outputs = [];
      getStoreState().sendCoinsModel.inputsTable = [];
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
    let newInputs = [...state.inputs];
    newInputs.push(commitment);
    state.inputs = newInputs;
  }),
  removeCustomInput: action((state, commitment) => {
    let newInputs = [...state.inputs];
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
    let table: {
      amount: number;
      block_height: number;
      commitment: string;
      keychain_path: string;
      status: string;
      transaction_id: number;
    }[] = [];

    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index] as {
        amount: number;
        block_height: number;
        commitment: string;
        keychain_path: string;
        status: string;
        transaction_id: number;
      };
      table.push(element);
    }
    state.inputsTable = table;
  }),
  setInputs: action((state, inputs) => {
    if (inputs.length === 0) return;
    let table: string[] = [];

    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index] as {
        amount: number;
        block_height: number;
        commitment: string;
        keychain_path: string;
        status: string;
        transaction_id: number;
      };
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
  getOutputs: thunk(
    async (actions, token, { injections, getStoreActions, getStoreState }) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .getOutputs(token)
        .then((response) => {
          if (typeof response === "string") {
            throw new Error(response);
          }
          actions.setInputsTable(response);
          let commitments: string[] = [];
          response.forEach((input) => {
            commitments.push(input.commitment);
          });
          actions.fillInputs(commitments);
          actions.fillOutputs(commitments);
        });
    }
  ),
  estimateFee: thunk(
    async (
      actions,
      payload,
      { injections, getStoreActions, getStoreState }
    ) => {
      const { ownerService, utilsService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .estimateFee(
          payload.token,
          payload.amount,
          payload.strategy,
          payload.inputs,
          payload.message
        )
        .then((response) => {
          let commitments: string[] = [];
          response.inputs.forEach((input) => {
            commitments.push(input.commitment);
          });
          actions.fillInputs(commitments);
          getStoreActions().sendCoinsModel.setEstimatedFee(
            utilsService.formatGrinAmount(response.fee)
          );
        });
    }
  ),
  sendViaFile: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState, getStoreActions }
    ): Promise<boolean> => {
      const apiSettings = getStoreState().settings.defaultSettings;
      const { ownerService, utilsService } = injections;

      const file = await utilsService.saveAs(utilsService.getHomePath());
      if (file.canceled) return false;

      return await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .sendCoinsViaFile(
          payload.token,
          payload.amount,
          payload.strategy,
          payload.inputs,
          payload.message,
          file.filePath
        )
        .then((response) => {
          // Let's clean a bit
          actions.setInitialValues();

          return true;
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  ),
  sendUsingListener: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState, getStoreActions }
    ): Promise<string> => {
      const { ownerService, utilsService, foreingService } = injections;
      const defaultSettings = getStoreState().settings.defaultSettings;

      let destinationAddress = payload.address.replace(/\/?$/, "/"); //removing trailing /
      const type = utilsService.validateAddress(destinationAddress); // check if the address is valid
      if (type === false) {
        return "invalid_destination_address";
      } else if (type === "tor") {
        destinationAddress = utilsService.cleanOnionURL(destinationAddress); // clean the Tor address
      } else if (type === "http") {
        // Let's try to reach the wallet first
        try {
          if (!(await foreingService.RPC.check(destinationAddress))) {
            return "not_online";
          }
        } catch (error) {
          return "not_online";
        }
      }

      // We're good to go; Let's clean a bit
      actions.setInitialValues();

      try {
        if (type === "tor") {
          const response = await new ownerService.RPC(
            defaultSettings.floonet,
            defaultSettings.protocol,
            defaultSettings.ip,
            defaultSettings.mode
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
          return "sent";
        } else if (type === "http") {
          const slate = await new ownerService.RPC(
            defaultSettings.floonet,
            defaultSettings.protocol,
            defaultSettings.ip,
            defaultSettings.mode
          ).sendCoins(
            payload.token,
            payload.amount,
            payload.message,
            payload.strategy,
            payload.inputs,
            payload.method,
            payload.grinJoinAddress
          );
          if (typeof slate === "string") {
            return slate;
          }
          const receivedSlate = await foreingService.RPC.receive(
            destinationAddress,
            slate
          );
          const finalized = await new ownerService.RPC().finalizeTx(
            payload.token,
            receivedSlate,
            payload.method,
            payload.grinJoinAddress
          );
          if (typeof finalized === "string") {
            return finalized;
          }
          return "sent";
        }
      } catch (error) {
        return error;
      }

      return "unkown_error";
    }
  ),
  onStrategyChanged: thunkOn(
    (actions, storeActions) => [storeActions.sendCoinsModel.setStrategy],
    async (actions, target, { injections, getStoreState }) => {
      await actions
        .estimateFee({
          amount: Number(getStoreState().sendCoinsModel.amount),
          strategy: getStoreState().sendCoinsModel.strategy,
          message: getStoreState().sendCoinsModel.message,
          token: getStoreState().session.token,
          inputs: getStoreState().sendCoinsModel.inputs,
        })
        .catch((error: { message: string }) => {
          actions.setError(error.message);
        });
    }
  ),
  onCustomInputsChanged: thunkOn(
    (actions, storeActions) => [
      storeActions.sendCoinsModel.addCustomInput,
      storeActions.sendCoinsModel.removeCustomInput,
    ],
    async (actions, target, { injections, getStoreState }) => {
      await actions
        .estimateFee({
          amount: Number(getStoreState().sendCoinsModel.amount),
          strategy: getStoreState().sendCoinsModel.strategy,
          message: getStoreState().sendCoinsModel.message,
          token: getStoreState().session.token,
          inputs: getStoreState().sendCoinsModel.inputs,
        })
        .catch((error: { message: string }) => {
          actions.setError(error.message);
        });
    }
  ),
  isAddressValid: computed((state) => {
    if (validateAddress(state.address) === false) return false;
    return true;
  }),
};

export default sendCoinsModel;
