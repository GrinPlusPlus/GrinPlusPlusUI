import { Action, Thunk, action, thunk } from "easy-peasy";

import { Injections } from "../../store";
import { StoreModel } from "..";

export interface ReceiveCoinsModel {
  slatepack: string;
  returnedSlatepack: string;
  setSlatepack: Action<ReceiveCoinsModel, string>;
  setReturnedSlatepack: Action<ReceiveCoinsModel, string>;
  waitingResponse: boolean;
  setWaitingResponse: Action<ReceiveCoinsModel, boolean>;
  receiveTxViaSlatepack: Thunk<
    ReceiveCoinsModel,
    string,
    Injections,
    StoreModel
  >;
}

const receiveCoinsModel: ReceiveCoinsModel = {
  slatepack: "",
  setSlatepack: action((state, slatepack) => {
    state.slatepack = slatepack;
  }),
  returnedSlatepack: "",
  setReturnedSlatepack: action((state, slatepack) => {
    state.returnedSlatepack = slatepack;
  }),
  waitingResponse: false,
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
  receiveTxViaSlatepack: thunk(
    async (
      actions,
      slatepack,
      { injections, getStoreState, getStoreActions }
    ): Promise<{ error: string; slatepack: string }> => {
      var error: string = "";
      let received_slatepack: string = "";

      const { ownerService } = injections;

      // Now, let's send the file to the Node
      const apiSettings = getStoreState().settings.defaultSettings;

      const response = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).receiveTx(getStoreState().session.token, slatepack, "");

      // Let's make sure there is no error...
      if (response == null) {
        error = "unknown_error";
      } else if (response.error.length > 0) {
        error = `😪 ${response.error}`;
      } else {
        received_slatepack = response.slatepack;
      }

      return { error: error, slatepack: received_slatepack };
    }
  ),
};

export default receiveCoinsModel;
