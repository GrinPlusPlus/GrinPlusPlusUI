export const GrinChck = (api: string, address: string): Promise<boolean> => {
  const request = window.require("request");
  const options = {
    method: "POST",
    url: api,
    agent: false,
    headers: {
      ContetType: "application/x-www-form-urlencoded",
      Accept: "application/json, text/plain, */*",
    },
    form: `wallet=${address}`,
  };
  return new Promise((resolve, reject) => {
    request.post(options, (error: string, response: any, body: string) => {
      if (response.hasOwnProperty("statusCode")) resolve(response.statusCode === 200);
      if (error) {
        reject(error);
      }
      reject("Unknown error");
    });
  });
};
