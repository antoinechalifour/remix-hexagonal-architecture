/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "~/(.*)$": "<rootDir>/app/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
};
