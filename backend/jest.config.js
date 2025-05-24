module.exports = {
    // Specifies the test environment that will be used for testing
    testEnvironment: 'node',
  
    // Verbose output shows individual test results with the test suite hierarchy.
    verbose: true,
    testTimeout: 600000,
  
    // Patterns Jest uses to detect test files.
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)", // Tests inside __tests__ folders
      "**/?(*.)+(spec|test).[tj]s?(x)" // Files with .spec.js, .test.js, etc.
    ],
  
    // Uncomment and configure this if you are using Babel to transpile your code:
    // transform: {
    //   "^.+\\.js$": "babel-jest"
    // },
  
    // Setup file(s) that run some code to configure or set up the testing framework before each test.
    // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  };
  