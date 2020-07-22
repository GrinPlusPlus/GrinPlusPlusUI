import { BaseApi } from "../../api";
import { ITransaction } from "../../../interfaces/ITransaction";

export class OwnerRPCApi extends BaseApi {
  public get url(): string {
    return this.getURL("ownerRPC");
  }

  public async createWallet(
    username: string,
    password: string,
    seedLength: string
  ): Promise<{ username: string; token: string; address: string; slatepack_address: string; seed: string[] }> {
    return await this.makeRPCRequest(
      this.getRequestURL("create_wallet"),
      "create_wallet",
      { username: username, password: password, num_seed_words: +seedLength }
    ).then((response) => {
      if (response.error) throw new Error(response.error.message);
      return {
        username: username,
        token: response.result.session_token,
        address: response.result.tor_address,
        slatepack_address: response.result.slatepack_address,
        seed: response.result.wallet_seed.split(" "),
      };
    });
  }

  public async restoreWallet(
    username: string,
    password: string,
    seed: string
  ): Promise<{ username: string; token: string; address: string; slatepack_address: string }> {
    return await this.makeRPCRequest(
      this.getRequestURL("restore_wallet"),
      "restore_wallet",
      {
        username: username,
        password: password,
        wallet_seed: seed,
      }
    ).then((response) => {
      if (response.error) throw new Error(response.error.message);
      return {
        username: username,
        token: response.result.session_token,
        address: response.result.tor_address,
        slatepack_address: response.result.slatepack_address
      };
    });
  }

  public async sendCoinsViaFile(
    token: string,
    amount: number,
    strategy: string,
    inputs: string[],
    message: string,
    file: string
  ): Promise<string | {}> {
    return await this.makeRPCRequest(this.getRequestURL("send"), "send", {
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
  ): Promise<string | { slatepack: string; status: "SENT" | "FINALIZED";}> {
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
    require("electron-log").info(`${address}`);
    require("electron-log").info(params);

    return await this.makeRPCRequest(
      this.getRequestURL("send"),
      "send",
      params
    ).then((response) =>
      response.error ? response.error.message : {
        slatepack: response.result.slatepack,
        status: response.result.status
       }
    );
  }

  public async receiveTx(
    token: string,
    slatepack: string,
    file: string
  ): Promise<{
    error: string;
    slatepack: string;
  }> {
    return await this.makeRPCRequest(this.getRequestURL("receive"), "receive", {
      session_token: token,
      slatepack: slatepack,
      file: file,
    }).then((response) =>
      response.error ? { error: response.error.message, slatepack: '' } : { error: '', slatepack: response.result.slatepack }
    );
  }

  public async finalizeTx(
    token: string,
    slatepack: string,
    method: string,
    grinJoinAddress: string,
    file?: string | null
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

    var payload : any = {
      session_token: token,
      slatepack: slatepack,
      post_tx: postTx,
    }

    if (file != null) {
      payload.file = file;
    }

    return await this.makeRPCRequest(
      this.getRequestURL("finalize"),
      "finalize",
      payload
    ).then((response) =>
      response.error
        ? response.error.message
        : response.result.status === "FINALIZED"
    );
  }

  public async getWalletAddress(token: string): Promise<string> {
    require("electron-log").info(`Trying to get wallet Address...`);
    return await this.makeRPCRequest(
      this.getRequestURL("get_address"),
      "retry_tor",
      {
        session_token: token,
      }
    ).then((response) => {
      require("electron-log").info(response.result);
      return response.result?.status === "SUCCESS"
        ? response.result.tor_address
        : "";
    });
  }

  public async login(username: string, password: string): Promise<{ username: string; token: string; address: string, slatepack_address: string }> {
    return await this.makeRPCRequest(this.getRequestURL("login"), "login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.error) throw new Error(response.error.message);
      return {
        username: username,
        token: response.result.session_token,
        address: response.result.tor_address,
        slatepack_address: response.result.slatepack_address
      }
    });
  }

  public async getSeed(username: string, password: string): Promise<string[]> {
    return await this.makeRPCRequest(
      this.getRequestURL("get_seed"),
      "get_wallet_seed",
      {
        username: username,
        password: password,
      }
    ).then((response) => {
      if (response.error) throw new Error(response.error.message);
      return response.result.wallet_seed.split(" ");
    });
  }

  public async getWalletBalance(
    token: string
  ): Promise<{
    spendable: number;
    total: number;
    immature: number;
    unconfirmed: number;
    locked: number;
  }> {
    return await this.makeRPCRequest(
      this.getRequestURL("get_balance"),
      "get_balance",
      {
        session_token: token,
      }
    ).then((response) => {
      if (response.error) throw new Error(response.error.message);
      return {
        spendable: response.result.spendable,
        total: response.result.total,
        immature: response.result.immature,
        unconfirmed: response.result.unconfirmed,
        locked: response.result.locked,
      };
    });
  }

  public async getTransactionsList(token: string): Promise<ITransaction[]> {
    return await this.makeRPCRequest(
      this.getRequestURL("list_txs"),
      "list_txs",
      {
        session_token: token,
      }
    ).then((response) => {
      let transactions: ITransaction[] = [];
      if (!response.result?.txs) return transactions;
      transactions = response.result.txs.reverse().map((transaction: any) => {
        return {
          Id: transaction.id,
          address: transaction.address,
          creationDate: transaction.creation_date_time,
          amountCredited: transaction.amount_credited,
          amountDebited: transaction.amount_debited,
          type: transaction.type,
          confirmedHeight: transaction.confirmed_height,
          fee: transaction.fee,
          slateId: transaction.slate_id,
          slateMessage: transaction.slate_message,
          kernels: transaction.kernels?.map(
            (kernel: { commitment: string }) => kernel.commitment
          ),
          outputs: transaction.outputs?.map(
            (output: {
              amount: number;
              block_height: number;
              commitment: string;
              keychain_path: string;
              label: string;
              status: string;
              transaction_id: number;
            }) => {
              return { amount: output.amount, commitment: output.commitment };
            }
          ),
        };
      });
      return transactions;
    });
  }

  public async logout(token: string): Promise<boolean> {
    return await this.makeRPCRequest(this.getRequestURL("logout"), "logout", {
      session_token: token,
    }).then((response) => (response.error ? false : true));
  }

  public async estimateFee(
    token: string,
    amount: number,
    strategy: string = "SMALLEST",
    inputs: string[] = [],
    message: string = ""
  ): Promise<{
    fee: number;
    inputs: {
      amount: number;
      block_height: number;
      commitment: string;
      keychain_path: string;
      status: string;
      transaction_id: number;
    }[];
  }> {
    return await this.makeRPCRequest(
      this.getRequestURL("estimate_fee"),
      "estimate_fee",
      {
        session_token: token,
        amount: amount * Math.pow(10, 9),
        fee_base: 1000000,
        selection_strategy: {
          strategy: strategy,
          inputs: strategy === "SMALLEST" ? [] : inputs,
        },
        message: message,
      }
    ).then((response) => {
      if (response.error) throw new Error(response.error.message);
      return response.result;
    });
  }

  public async cancelTx(token: string, txId: number): Promise<string> {
    return await this.makeRPCRequest(
      `${this.getRequestURL("cancel_tx")}`,
      "cancel_tx",
      { session_token: token, tx_id: txId }
    ).then((response) => {
      if (response.error) throw new Error(response.error.message);
      return response.result;
    });
  }

  public async repostTx(
    token: string,
    txId: number,
    method: string
  ): Promise<string> {
    return await this.makeRPCRequest(
      `${this.getRequestURL("repost_tx")}`,
      "repost_tx",
      { session_token: token, tx_id: txId, method: method }
    ).then((response) => {
      if (response.error) throw new Error(response.error.message);
      return response.result;
    });
  }
}
