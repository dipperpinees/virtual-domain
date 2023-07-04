import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from "os";

const logsPath = path.join(os.homedir(), "./bss-logs.txt");

const writeLogs = (data: string) => {
    fs.appendFileSync(logsPath, data);
};

const childProcess = spawn("node", [path.join(__dirname, "./server.js")], {
    detached: true,
});

childProcess.stdout.on('data', (data) => {
    writeLogs(`${data}`);
});

childProcess.unref();
