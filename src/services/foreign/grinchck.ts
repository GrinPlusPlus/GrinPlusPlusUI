export const GrinChck = (address: string, wallet: string): Promise<boolean> => {
  const tr = window.require("tor-request");
  tr.setTorAddress("127.0.0.1", 3422);
  return new Promise((resolve, reject) => {
    tr.request.post(
      {
        url: address,
        form: { wallet: wallet },
        timeout: 30000,
      },
      (error: any, response: any, body: string) => {
        resolve(!error && response.body === "reachable");
      }
    );
  });
};
