module.exports = function(config) {
  config.set({
    files: [
      'sdedit-bin/**',
      'bin/**',
      'src/**',
      'test/**',
      'testResources/**'
    ],
    mutate: ["src/**/*.ts", '!src/**/*.d.ts'],
    testRunner: "mocha",
    mutator: "typescript",
    transpilers: ["typescript"],
    reporters: ["html", "clear-text", "progress", "dashboard"],
    testFramework: "mocha",
    coverageAnalysis: "perTest",
    mochaOptions: {
      spec: ['test/helpers/**/*.js', 'test/unit/**/*.js']
    },
    tsconfigFile: "tsconfig.json",
    thresholds: {
      break: 63,
      high: 80,
      low: 60
    }
  });
};
