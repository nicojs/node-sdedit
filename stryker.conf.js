module.exports = function(config) {
  config.set({
    files: [
      '!src/**/*.d.ts',
      '!test/**/*.d.ts',
      '!test/integration/**/*.ts'
    ],
    mutate: ["src/**/*.ts", '!src/**/*.d.ts'],
    testRunner: "mocha",
    mutator: "typescript",
    transpilers: ["typescript"],
    reporter: ["html", "clear-text", "progress"],
    testFramework: "mocha",
    coverageAnalysis: "off",
    tsconfigFile: "tsconfig.json",
    thresholds: {
      break: 63,
      high: 80,
      low: 60
    }
  });
};
