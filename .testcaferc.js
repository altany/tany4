const fs = require('fs')

// Heroku CI installs Chrome for Testing here; elsewhere (GitHub Actions, locally) use the installed Chrome
const herokuChrome = '/app/.chrome-for-testing/chrome-linux64/chrome'
const chrome = fs.existsSync(herokuChrome) ? `chrome:${herokuChrome} --headless` : 'chrome:headless'

module.exports = {
    "browsers": [
      `${chrome} --no-sandbox --disable-native-automation --disable-features=LocalNetworkAccessChecks`
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
