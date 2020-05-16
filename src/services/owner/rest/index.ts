import { BaseApi } from "./../../api";

export class OwnerAPI extends BaseApi {
  public get url(): string {
    return this.getURL("owner");
  }

  public async getAccounts(): Promise<string[]> {
    return await this.makeRESTRequest(
      `${this.getRequestURL("accounts")}`,
      "get"
    )
      .then((data) => {
        try {
          return JSON.parse(data);
        } catch (ex) {
          return [];
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  public async getOutputs(
    token: string
  ): Promise<
    {
      amount: number;
      block_height: number;
      commitment: string;
      keychain_path: string;
      status: string;
      transaction_id: number;
    }[]
  > {
    return await this.makeRESTRequest(
      this.getRequestURL("retrieve_outputs"),
      "get",
      { session_token: token }
    ).then((response) => {
      return JSON.parse(response).outputs;
    });
  }
}
