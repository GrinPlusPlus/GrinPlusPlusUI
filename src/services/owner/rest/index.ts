import { BaseApi } from './../../api';
import { ITransaction } from '../../../interfaces/ITransaction';

export class OwnerAPI extends BaseApi {
  public get url(): string {
    return this.getURL("owner");
  }

  public async getWalletSummary(token: string): Promise<ITransaction[]> {
    return await this.makeRPCRequest(
      this.getRequestURL("list_txs"),
      "list_txs",
      {
        session_token: token,
      }
    ).then((response) => {
      let transactions: ITransaction[] = [];
      require("electron-log").error(response.result.txs);
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
          ouputs: transaction.outputs?.map(
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

  public async createWallet(
    username: string,
    password: string
  ): Promise<{ username: string; token: string; seed: string[] }> {
    return await this.makeRESTRequest(
      this.getRequestURL("create_wallet"),
      "post",
      { username: username, password: password }
    ).then((response) => {
      const data = JSON.parse(response);
      return {
        username: username,
        token: data.session_token,
        seed: data.wallet_seed.split(" "),
      };
    });
  }

  public async restoreWallet(
    username: string,
    password: string,
    seed: string
  ): Promise<{ username: string; token: string }> {
    return await this.makeRESTRequest(
      this.getRequestURL("restore_wallet"),
      "post",
      { username: username, password: password },
      { wallet_seed: seed }
    ).then((response) => {
      try {
        const data = JSON.parse(response);
        return { username: username, token: data.session_token };
      } catch (e) {
        throw new Error(response);
      }
    });
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
    return await this.makeRESTRequest(
      this.getRequestURL("tx_estimate_fee"),
      "post",
      { session_token: token },
      {
        amount: amount * Math.pow(10, 9),
        fee_base: 1000000,
        selection_strategy: {
          strategy: strategy,
          inputs: strategy === "SMALLEST" ? [] : inputs,
        },
        message: message,
      }
    ).then((response) => {
      try {
        return JSON.parse(response);
      } catch (e) {
        throw new Error(response);
      }
    });
  }

  public async cancelTx(token: string, txId: number): Promise<string> {
    return await this.makeRESTRequest(
      `${this.getRequestURL("tx_cancel")}?id=${txId}`,
      "post",
      { session_token: token }
    ).then((response: string) => response);
  }

  public async repostTx(token: string, txId: number): Promise<string> {
    return await this.makeRESTRequest(
      `${this.getRequestURL("tx_repost")}?id=${txId}`,
      "post",
      { session_token: token }
    ).then((response: string) => response);
  }

  public async updateWallet(token: string): Promise<boolean> {
    return await this.makeRESTRequest(
      `${this.getRequestURL("scan_outputs")}`,
      "post",
      { session_token: token }
    )
      .then((data) => true)
      .catch((error) => false);
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
