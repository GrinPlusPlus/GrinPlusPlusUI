export const GrinChck = (api: string, address: string): Promise<boolean> => {
  const tr = window.require("tor-request");
  tr.TorControlPort.password = 'MyPassword'
  tr.TorControlPort.port = '3423'
  tr.setTorAddress("127.0.0.1", 3422);
  return new Promise((resolve) => {
    tr.request.post(
      {
        url: api,
        form: { wallet: address },
        timeout: 35000,
      },
      (error: any, response: any) => {
        resolve(!error && response?.body === "reachable");
      }
    );
  });
};
