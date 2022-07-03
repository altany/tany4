const createTestCafe = require('testcafe');

createTestCafe('localhost', 3001, 3002)
    .then(testcafe => {
        return testcafe.createRunner()
        .startApp('PORT=3000 && node server.js', 10000) // serve the static build
        .run()
            .then(() => {
                testcafe.close()
            })
            .catch(console.error);
    }).catch(console.error)
   