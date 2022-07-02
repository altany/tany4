const createTestCafe = require('testcafe');

createTestCafe('localhost', 3001)
    .then(testcafe => {
        return testcafe.createRunner()
        .run()
            .then(() => {
                testcafe.close()
            })
            .catch(console.error);
    }).catch(console.error)
   