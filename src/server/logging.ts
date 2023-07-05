import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { LOGS_PATH } from '../configs';

const writeLogs = (data: string) => {
    fs.appendFileSync(LOGS_PATH, data);
};

const childProcess = spawn("node", [path.join(__dirname, "./server.js")], {
    detached: true,
});

childProcess.stdout.on('data', (data) => {
    writeLogs(`${data}`);
});

childProcess.unref();
