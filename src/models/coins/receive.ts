import { Action, Thunk, action, thunk } from "easy-peasy";

import { Injections } from "../../store";
import { StoreModel } from "..";

export interface ReceiveCoinsModel {
  responsesDestination: string | undefined;
  setResponsesDestination: Action<ReceiveCoinsModel, string>;
  receiveTx: Thunk<ReceiveCoinsModel, File[], Injections, StoreModel>;
  getAddress: Thunk<ReceiveCoinsModel, string, Injections, StoreModel>;
  waitingResponse: boolean;
  setWaitingResponse: Action<ReceiveCoinsModel, boolean>;
}

const receiveCoinsModel: ReceiveCoinsModel = {
  responsesDestination: undefined,
  setResponsesDestination: action((state, path) => {
    state.responsesDestination = path.trim();
  }),
  receiveTx: thunk(
    async (
      actions,
      files,
      { injections, getStoreState, getStoreActions }
    ): Promise<[string[], [string, {}][]]> => {
      const errors: string[] = [];
      let slates: [string, {}][] = [];

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

        // Let's try to parse the file...
        let slate: {};
        try {
          slate = JSON.parse(content);
        } catch (error) {
          errors.push("error_parsing_file");
          continue; //
        }

        // Now, let's send the file to the Node
        const apiSettings = getStoreState().settings.defaultSettings;

        const filePath = `${file.path}.response`;
        const response = await new ownerService.RPC(
          apiSettings.floonet,
          apiSettings.protocol,
          apiSettings.ip
        ).receiveTx(getStoreState().session.token, slate, filePath);

        // Let's make sure there is no error...
        if (typeof response === "string") {
          errors.push(`😪 ${response} (${fileName})`);
          continue;
        } else if (!response) {
          errors.push("unknown_error");
          continue;
        }
        // Alles gut!
        slates.push([fileName, response]);
      }
      return [errors, slates];
    }
  ),
  getAddress: thunk(
    async (actions, token, { injections, getStoreState, getStoreActions }) => {
      if (
        getStoreState().walletSummary.waitingResponse ||
        getStoreState().session.address.length === 56
      )
        return;
      actions.setWaitingResponse(true);
      try {
        const { ownerService } = injections;
        const apiSettings = getStoreState().settings.defaultSettings;
        const address = await new ownerService.RPC(
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
    }
  ),
  waitingResponse: false,
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
};

export default receiveCoinsModel;
