import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    // stub out electron in tests
    electron: "<rootDir>/src/__mocks__/electron.ts",
    "\\.(css|scss)$": "<rootDir>/src/__mocks__/fileMock.ts",
  },
};

export default config;
