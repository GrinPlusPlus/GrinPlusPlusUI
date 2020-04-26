import { BaseApi } from '../../api';

export class OwnerRPCApi extends BaseApi {
  public get url(): string {
    return this.getURL("ownerRPC");
  }

  public async sendCoinsViaFile(
    token: string,
    amount: number,
    strategy: string,
    inputs: string[],
    message: string,
    file: string
  ): Promise<string | {}> {
    return await this.makeRPCRequest(this.getRequestURL("tx_send"), "send", {
      session_token: token,
      amount: amount * Math.pow(10, 9),
      fee_base: 1000000,
      selection_strategy: {
        strategy: strategy,
        inputs: strategy === "SMALLEST" ? [] : inputs,
      },
      message: message,
      file: file,
    }).then((response) =>
      response.error ? response.error.message : response.result.slate
    );
  }

  public async sendCoins(
    token: string,
    amount: number,
    message: string,
    strategy: string,
    inputs: string[],
    method: string,
    grinJoinAddress: string,
    address?: string
  ): Promise<string | {}> {
    let postTx = {};
    if (method === "JOIN") {
      postTx = {
        method: method,
        grinjoin_address: grinJoinAddress,
      };
    } else {
      postTx = {
        method: method,
      };
    }
    let params = {
      session_token: token,
      amount: amount * Math.pow(10, 9),
      fee_base: 1000000,
      selection_strategy: {
        strategy: strategy,
        inputs: strategy === "SMALLEST" ? [] : inputs,
      },
      address: address,
      message: message,
      post_tx: postTx,
    };
    if (message === "") {
      delete params["message"];
    }
    if (address === "") {
      delete params["address"];
    }
    return await this.makeRPCRequest(
      this.getRequestURL("tx_send"),
      "send",
      params
    ).then((response) =>
      response.error ? response.error.message : response.result.slate
    );
  }

  public async receiveTx(
    token: string,
    slate: {},
    file: string
  ): Promise<{} | string> {
    return await this.makeRPCRequest(
      this.getRequestURL("tx_receive"),
      "receive",
      {
        session_token: token,
        slate: slate,
        file: file,
      }
    ).then((response) =>
      response.error ? response.error.message : response.result.slate
    );
  }

  public async finalizeTx(
    token: string,
    slate: {},
    method: string,
    grinJoinAddress: string,
    file?: string
  ): Promise<boolean | string> {
    let postTx = {};
    if (method === "JOIN") {
      postTx = {
        method: method,
        grinjoin_address: grinJoinAddress,
      };
    } else {
      postTx = {
        method: method,
      };
    }
    return await this.makeRPCRequest(
      this.getRequestURL("tx_finalize"),
      "finalize",
      {
        session_token: token,
        slate: slate,
        file: file,
        post_tx: postTx,
      }
    ).then((response) =>
      response.error
        ? response.error.message
        : response.result.success === "FINALIZED"
    );
  }

  public async getWalletAddress(token: string): Promise<string> {
    return await this.makeRPCRequest(
      this.getRequestURL("tor_address"),
      "retry_tor",
      {
        session_token: token,
      }
    ).then((response) => {
      return response.result?.status === "SUCCESS"
        ? response.result.tor_address
        : "";
    });
  }

  public async login(username: string, password: string): Promise<string> {
    return await this.makeRPCRequest(this.getRequestURL("login"), "login", {
      username: username,
      password: password,
    }).then((response) =>
      response.error ? response.error.message : response.result.session_token
    );
  }
}
