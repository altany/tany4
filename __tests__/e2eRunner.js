const createTestCafe = require('testcafe');

let testcafe
createTestCafe('localhost', 3001, 3002)
    .then(testcafeInstance => {
        testcafe = testcafeInstance
        return testcafe.createRunner()
            .startApp('PORT=3000 node server.js', 1000) // serve the static build
            .run()
    }).then(()=>{
        testcafe.close()
    }).catch(console.error)
   