/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["*/**/__tests__/*.spec.ts"],
  testPathIgnorePatterns: ["dist"],
}
