module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
        "pageTitle": "Test Report"
    }]
]
};
