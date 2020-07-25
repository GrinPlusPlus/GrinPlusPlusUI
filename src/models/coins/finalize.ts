import { Action, Thunk, action, thunk } from "easy-peasy";

import { Injections } from "../../store";
import { StoreModel } from "..";

export interface FinalizeModel {
  responseFile: File | undefined;
  setResponseFile: Action<FinalizeModel, File | undefined>;
  finalizeTx: Thunk<
    FinalizeModel,
    {
      file: File;
      method: string;
      grinJoinAddress: string;
    },
    Injections,
    StoreModel
  >;
  finalizeTxViaSlatepack: Thunk<FinalizeModel, string, Injections, StoreModel>;
}

const finalizeModel: FinalizeModel = {
  responseFile: undefined,
  setResponseFile: action((state, file) => {
    state.responseFile = file;
  }),
  finalizeTx: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState, getStoreActions }
    ): Promise<string> => {
      actions.setResponseFile(undefined);
      const { ownerService, utilsService } = injections;

      // Now we read the file...
      const content = await utilsService.getTextFileContent(payload.file);

      if (!content) {
        return "error_reading_file";
      }

      // Send the file to the node
      const apiSettings = getStoreState().settings.defaultSettings;
      const response = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).finalizeTx(
        getStoreState().session.token,
        content,
        payload.method,
        payload.grinJoinAddress,
        `${payload.file.name}.finalized`
      );

      // Check the results
      if (typeof response === "string") {
        return response;
      }

      // Alles gut!
      return "finalized";
    }
  ),
  finalizeTxViaSlatepack: thunk(
    async (
      actions,
      slatepack,
      { injections, getStoreState, getStoreActions }
    ): Promise<{ error: string | null }> => {
      actions.setResponseFile(undefined);
      const { ownerService } = injections;

      // Send the file to the node
      const apiSettings = getStoreState().settings.defaultSettings;
      const response = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).finalizeTx(getStoreState().session.token, slatepack, "STEM", "", null);

      // Check the results
      if (typeof response === "string") {
        return { error: response };
      }

      // Alles gut!
      return { error: null };
    }
  ),
};

export default finalizeModel;
