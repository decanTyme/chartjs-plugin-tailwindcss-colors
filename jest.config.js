/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  runner: "@kayahr/jest-electron-runner",
  testEnvironment: "@kayahr/jest-electron-runner/environment",
  testMatch: ["*/**/__tests__/*.(spec|test).ts"],
  testPathIgnorePatterns: ["dist"],
  coveragePathIgnorePatterns: ["test"],

  globals: {
    "ts-jest": {
      tsConfig: "./src/__tests__/tsconfig.test.json",
    },
  },
}
