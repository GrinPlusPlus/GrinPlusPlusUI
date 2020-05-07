import { Action, action, Thunk, thunk } from "easy-peasy";
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

      // Parse the file...
      let slate: {};
      try {
        slate = JSON.parse(content);
      } catch (error) {
        return "error_parsing_file";
      }

      // Send the file to the node
      const apiSettings = getStoreState().settings.defaultSettings;
      const response = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      ).finalizeTx(
        getStoreState().session.token,
        slate,
        payload.method,
        payload.grinJoinAddress,
        `${payload.file.name}.response`
      );

      // Check the results
      if (typeof response === "string") {
        return response;
      }

      // Alles gut!
      return "finalized";
    }
  ),
};

export default finalizeModel;
