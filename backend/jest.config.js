module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageReporters: ["text", "lcov", "clover", "html"],
  testMatch: ["**/__tests__/**/*.test.js"],
};
