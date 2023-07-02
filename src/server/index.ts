import { spawn } from 'child_process';
import path from 'path';
import startCerts from "../utils/certs";
import startHosts from "../utils/hosts";
import killProcess from '../utils/killProcess';

export const startServer = async () => {
    startCerts();
    startHosts();
    await stopServer();

    const childProcess = spawn('node', [path.join(__dirname, "./logging.js")], {
        detached: true,
        stdio: 'ignore',
    });
    
    childProcess.unref();
};

export const stopServer = async () => {
    await killProcess(80);
    await killProcess(443);
};
