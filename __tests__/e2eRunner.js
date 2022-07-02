const createTestCafe = require('testcafe');

createTestCafe('localhost', 3001)
    .then(testcafe => {
        return testcafe.createRunner()
        .startApp('npm run dev')
        .run()
            .then(() => {
                testcafe.close()
            })
            .catch(console.error);
    }).catch(console.error)
   