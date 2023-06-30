import { spawn } from 'child_process';
import kill from 'kill-port';
import startCerts from "../utils/certs";
import startHosts from "../utils/hosts";
import path from 'path';

export const startServer = async () => {
    startCerts();
    startHosts();
    await stopServer();

    const childProcess = spawn('node', [path.join(__dirname, "./server.ts")], {
        detached: true,
        stdio: 'ignore',
    });
    childProcess.unref();
};

export const stopServer = async () => {
    await kill(80, 'tcp');
    await kill(443, 'tcp');
};
