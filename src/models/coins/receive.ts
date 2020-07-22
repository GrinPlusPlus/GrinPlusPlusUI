import { Action, Thunk, action, thunk } from "easy-peasy";

import { Injections } from "../../store";
import { StoreModel } from "..";

export interface ReceiveCoinsModel {
  responsesDestination: string | undefined;
  slatepack: string;
  setSlatepack: Action<ReceiveCoinsModel, string>;
  setResponsesDestination: Action<ReceiveCoinsModel, string>;
  receiveTx: Thunk<ReceiveCoinsModel, File[], Injections, StoreModel>;
  getAddress: Thunk<ReceiveCoinsModel, string, Injections, StoreModel>;
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
  responsesDestination: undefined,
  slatepack: "",
  setSlatepack: action((state, slatepack) => {
    state.slatepack = slatepack;
  }),
  setResponsesDestination: action((state, path) => {
    state.responsesDestination = path.trim();
  }),
  receiveTx: thunk(
    async (
      actions,
      files,
      { injections, getStoreState, getStoreActions }
    ): Promise<{
      errors: string[];
      slatepacks: {
        filename: string;
        slatepack: string;
      }[];
    }> => {
      const errors: string[] = [];
      let slatepacks: { filename: string; slatepack: string }[] = [];

      const { ownerService, utilsService } = injections;

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        let fileName = file.name.trim().replace(/\s+/g, "_");

        // Read the file as Text
        const content = await utilsService.getTextFileContent(file);
        if (!content) {
          errors.push("error_reading_file");
          continue;
        } // Exit if the file is empty

        // Now, let's send the file to the Node
        const apiSettings = getStoreState().settings.defaultSettings;

        const filePath = `${file.path}.response`;
        const response = await new ownerService.RPC(
          apiSettings.floonet,
          apiSettings.protocol,
          apiSettings.ip
        ).receiveTx(getStoreState().session.token, content, filePath);

        if (response == null) {
          errors.push("unknown_error");
          continue;
        } else if (response.error.length > 0) {
          errors.push(`😪 ${response} (${fileName})`);
          continue;
        }

        // Let's make sure there is no error...
        if (typeof response === "string") {
          errors.push(`😪 ${response} (${fileName})`);
          continue;
        } else if (!response) {
          errors.push("unknown_error");
          continue;
        }
        // Alles gut!
        slatepacks.push({ filename: fileName, slatepack: response.slatepack });
      }
      return { errors: errors, slatepacks: slatepacks };
    }
  ),
  getAddress: thunk(
    async (actions, token, { injections, getStoreState, getStoreActions }) => {
      if (
        getStoreState().walletSummary.waitingResponse ||
        getStoreState().session.address.length === 56
      ) {
        return getStoreState().session.address;
      }
      actions.setWaitingResponse(true);

      let address = null;
      try {
        const { ownerService } = injections;
        const apiSettings = getStoreState().settings.defaultSettings;
        address = await new ownerService.RPC(
          apiSettings.floonet,
          apiSettings.protocol,
          apiSettings.ip
        ).getWalletAddress(token);
        getStoreActions().session.setAddress(address);
      } catch (error) {
        require("electron-log").info(
          `Error trying to get Wallet Address: ${error}`
        );
      }
      actions.setWaitingResponse(false);
      return address;
    }
  ),
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

  // thunk(
  //   (
  //     actions,
  //     slate,
  //     { injections, getStoreState, getStoreActions }
  //   ): boolean => {
  //     return true;
  //   }
  // ),
};

export default receiveCoinsModel;
