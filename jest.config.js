const nextJest = require("next/jest");

// Pointing at the app root loads next.config.js and the .env files into the tests
const createJestConfig = nextJest({ dir: "./" });

const asyncConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/__tests__/snapshots/**/*.[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  clearMocks: true,
});

// The markdown pipeline is published as ESM, so remark and everything under it has to
// go through the transform. The CSS modules must not, or they stop resolving to class names.
const ESM_PACKAGES = [
  "remark.*",
  "unified",
  "unist-.*",
  "mdast-.*",
  "micromark.*",
  "hast-.*",
  "vfile.*",
  "property-information",
  "(space|comma)-separated-tokens",
  "stringify-entities",
  "character-entities.*",
  "decode-named-character-reference",
  "html-void-elements",
  "is-plain-obj",
  "zwitch",
  "longest-streak",
  "trough",
  "bail",
  "ccount",
  "trim-lines",
].join("|");

// next/jest builds its config asynchronously, so the overrides go on afterwards
module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [
    "^.+\\.module\\.(css|sass|scss)$",
    `/node_modules/(?!(${ESM_PACKAGES})/)`,
  ];
  return config;
};
