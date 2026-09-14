const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const createTestCafe = require('testcafe');

const root = path.join(__dirname, '..');
const buildId = path.join(root, '.next', 'BUILD_ID');
// Anything that changes what `next build` produces
const sources = ['pages', 'components', 'lib', 'hooks', 'src', 'styles', 'posts', 'next.config.js', 'package-lock.json'];

const newestMtime = (target) => {
    const full = path.join(root, target);
    if (!fs.existsSync(full)) return 0;
    const stat = fs.statSync(full);
    if (!stat.isDirectory()) return stat.mtimeMs;
    return Math.max(0, ...fs.readdirSync(full).map(entry => newestMtime(path.join(target, entry))));
};

// The tests run against the production build, so make sure it exists and is current
if (!fs.existsSync(buildId)) {
    console.log('No production build found. Running `npm run build`...');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
} else if (Math.max(...sources.map(newestMtime)) > fs.statSync(buildId).mtimeMs) {
    console.log('Production build is older than the source. Running `npm run build`...');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
}

let testcafe
createTestCafe('localhost', 3001, 3002)
    .then(testcafeInstance => {
        testcafe = testcafeInstance
        return testcafe.createRunner()
            .startApp('PORT=3000 npm start', 1000) // serve the production build
            .run()
    }).then(failedCount=>{
        testcafe.close()
        if(failedCount>0) {
            throw new Error(`${failedCount} tests failed`)
        }
    })
