module.exports = {
    "browsers": ["chrome"],
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