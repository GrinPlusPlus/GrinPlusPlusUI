// mocks/electronMock.js
export const remote = {
  app: {
    getPath: jest.fn().mockReturnValue(""),
    getAppPath: jest.fn().mockReturnValue(""),
  },
  process: {
    platform: "linux",
  },
};
