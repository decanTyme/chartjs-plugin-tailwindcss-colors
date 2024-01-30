import type { JestConfigWithTsJest } from "ts-jest"
import { defaults } from "ts-jest/presets"

const config: JestConfigWithTsJest = {
  runner: "@kayahr/jest-electron-runner",
  testEnvironment: "@kayahr/jest-electron-runner/environment",
  testMatch: ["*/**/__tests__/*.(spec|test).ts"],
  testPathIgnorePatterns: ["dist"],
  coveragePathIgnorePatterns: ["test"],
  setupFilesAfterEnv: ["./src/__tests__/setup.ts"],
  randomize: true,

  transform: {
    "^.+\\.[jt]sx?$": [
      "ts-jest",
      { ...defaults, tsconfig: "./src/__tests__/tsconfig.test.json" },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!color-name)"],
}

export default config
