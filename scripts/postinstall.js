const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { pipeline } = require('stream');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function downloadFile(url, to) {
    if (!fs.existsSync(path.dirname(to))) {
        fs.mkdirSync(path.dirname(to));
    }
    const streamPipeline = util.promisify(pipeline);
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) throw new Error("Couldn't download file");
    const fileObject = fs.createWriteStream(to);
    await streamPipeline(response.body, fileObject);
    return to;
}

const exec = (command) => {
    execSync(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            return;
        }
        console.log(stdout);
        console.error(`${stderr}`);
    });
};

const installForLinux = async () => {
    try {
        await downloadFile('https://dl.filippo.io/mkcert/latest?for=linux/amd64', path.join(__dirname, '../bin/mkcert'));
        exec('chmod +x ./bin/mkcert');
        exec('./bin/mkcert -install');
        console.log('Install mkcert successfully!!');
    } catch (e) {
        console.error(e.message);
    }
};

const installForWindows = async () => {
    try {
        await downloadFile('https://dl.filippo.io/mkcert/latest?for=windows/amd64', path.join(__dirname, '../bin/mkcert.exe'));
        exec(`.\\bin\\mkcert.exe -install`);
        console.log('Install mkcert successfully!!');
    } catch (e) {
        console.error(e.message);
    }
};

if (process.platform === 'linux') {
    installForLinux();
}

if (process.platform === 'win32') {
    installForWindows();
}
