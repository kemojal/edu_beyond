module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/_test_/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  watchman: false,
};
