import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const writeLogs = (data: string) => {
    fs.appendFileSync('logs.txt', data);
};

const childProcess = spawn("node", [path.join(__dirname, "./server.js")], {
    detached: true,
});

childProcess.stdout.on('data', (data) => {
    writeLogs(`${data}`);
});

childProcess.unref();
