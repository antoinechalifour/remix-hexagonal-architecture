/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "front/(.*)$": "<rootDir>/app/$1",
    "todo-list-manager$": "<rootDir>/src/todo-list-manager",
    infrastructure$: "<rootDir>/src/infrastructure",
    "shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
};
