import { Thunk, thunk } from "easy-peasy";

import { Injections } from "../../store";
import { StoreModel } from "..";

export interface FinalizeModel {
  finalizeTxViaSlatepack: Thunk<FinalizeModel, string, Injections, StoreModel>;
}

const finalizeModel: FinalizeModel = {
  finalizeTxViaSlatepack: thunk(
    async (
      actions,
      slatepack,
      { injections, getStoreState, getStoreActions }
    ): Promise<{ error: string | null }> => {
      const { ownerService } = injections;

      // Send the file to the node
      const apiSettings = getStoreState().settings.defaultSettings;
      const response = await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      ).finalizeTx(
        getStoreState().session.token,
        slatepack,
        null,
        "FLUFF",
        "",
        null
      );

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
