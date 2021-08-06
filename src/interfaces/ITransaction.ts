export interface ITransaction {
  Id: number;
  address?: string;
  amount: number;
  creationDate: Date;
  type: string;
  confirmedHeight: number;
  fee: number;
  slateId: string;
  slateMessage?: string;
  slatepackMessage?: string;
  kernels?: string[];
  outputs?: {
    amount: number;
    commitment: string;
  }[];
}
