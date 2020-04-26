// mocks/childProcessMock.js
jest.mock(
    'child_process',
    () => ({
      execSync: () =>
          '2501 ??         0:39.76 /Users/davidtavarez/Projects/grinble/bin/GrinNode --headless --floonet'
    }));
