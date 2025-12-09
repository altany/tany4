module.exports = {
    "browsers": [
      'chrome:/app/.chrome-for-testing/chrome-linux64/chrome --headless --no-sandbox --disable-native-automation --disable-features=LocalNetworkAccessChecks'
    ],
    "clientScripts": [
        { "module": "@testing-library/dom/dist/@testing-library/dom.umd.js" }
    ],
    userVariables: {
        baseUrl: "http://localhost:3000",
        user: {
          password: 'password'
        }
      },
    "src": "__tests__/e2e/"
}