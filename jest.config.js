// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/snapshots/**/*.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  clearMocks: true
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
//module.exports = createJestConfig(customJestConfig)

// Take the returned async function...
const asyncConfig = createJestConfig(customJestConfig)
const remarkIgnoredModules = [
  'remark',
  'remark-parse',
  'remark-stringify',
  'remark-html',
  'mdast-util-from-markdown',
  'mdast-util-to-string',
  'mdast-util-to-markdown',
  'mdast-util-to-hast',
  'mdast-util-definitions',
  'micromark',
  'micromark-util-combine-extensions',
  'micromark-util-chunked',
  'micromark-factory-space',
  'micromark-util-character',
  'micromark-core-commonmark',
  'micromark-util-classify-character',
  'micromark-util-resolve-all',
  'micromark-util-subtokenize',
  'micromark-factory-destination',
  'micromark-factory-label',
  'micromark-factory-title',
  'micromark-factory-whitespace',
  'micromark-util-normalize-identifier',
  'micromark-util-html-tag-name',
  'micromark-util-decode-numeric-character-reference',
  'micromark-util-decode-string',
  'micromark-util-sanitize-uri',
  'micromark-util-encode',
  'bail',
  'unified',
  'is-plain-obj',
  'trough',
  'vfile',
  'vfile-message',
  'unist-util-stringify-position',
  'unist-builder',
  'unist-util-position',
  'unist-util-generated',
  'decode-named-character-reference',
  'zwitch',
  'longest-streak',
  'unist-util-visit',
  'unist-util-visit-parents',
  'unist-util-is',
  'hast-util-to-html',
  'hast-util-is-element',
  'hast-util-whitespace',
  'hast-util-sanitize',
  'property-information',
  'html-void-elements',
  'space-separated-tokens',
  'comma-separated-tokens',
  'stringify-entities',
  'character-entities-legacy',
  'character-entities-html4',
  'ccount'
].join('|')

// and wrap it...
module.exports = async () => {
  const config = await asyncConfig()
  config.transformIgnorePatterns = [
      "^.+\\.module\\.(css|sass|scss)$",
      `/node_modules/(?!(${remarkIgnoredModules})/)`
  ]
  return config
}