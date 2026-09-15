const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync, spawn } = require('child_process');
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

const waitForServer = (url, timeoutMs) => new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    const attempt = () => http.get(url, res => { res.resume(); resolve(); })
        .on('error', () => Date.now() > deadline
            ? reject(new Error(`The app did not start on ${url}`))
            : setTimeout(attempt, 250));
    attempt();
});

// Serve the production build. Started here rather than with TestCafe's startApp,
// which spawns through a shell and triggers Node's DEP0190 warning.
// detached gives npm, its shell and the server their own process group. Stopping the
// whole group matters on Linux, where sh (dash) doesn't pass signals on to the server.
const app = spawn('npm', ['start'], { cwd: root, env: { ...process.env, PORT: '3000' }, stdio: 'inherit', detached: true });
const stopApp = () => {
    try {
        process.kill(-app.pid, 'SIGTERM')
    } catch (e) {
        // Already stopped
    }
}
for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        stopApp()
        process.exit(1)
    })
}

let testcafe
waitForServer('http://localhost:3000', 60000)
    .then(() => createTestCafe('localhost', 3001, 3002))
    .then(testcafeInstance => {
        testcafe = testcafeInstance
        return testcafe.createRunner().run()
    })
    .finally(() => {
        if (testcafe) testcafe.close()
        stopApp()
    })
    .then(failedCount=>{
        if(failedCount>0) {
            throw new Error(`${failedCount} tests failed`)
        }
    })
