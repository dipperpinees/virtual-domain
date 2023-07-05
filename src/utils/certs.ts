import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { CERTS_DIR_PATH, configs } from '../configs';

const checkExists = (domain: string) => {
    const certPart = path.join(CERTS_DIR_PATH, `./${domain}.pem`);
    const keyPart = path.join(CERTS_DIR_PATH, `./${domain}-key.pem`);
    if (fs.existsSync(certPart) && fs.existsSync(keyPart)) {
        const stats = fs.statSync(certPart);
        const fileCreatedTime = stats.ctime.getTime();
        if (new Date().getTime() - fileCreatedTime < 3 * 30 * 24 * 60 * 60 * 1000) return true;
    }

    return false;
};

export default () => {
    if (!fs.existsSync(CERTS_DIR_PATH)) {
        fs.mkdirSync(CERTS_DIR_PATH);
    }
    for (const config of configs.getAll()) {
        if (checkExists(config.domain)) continue;
        if (process.platform === 'linux') {
            const result = execSync(`cd ${CERTS_DIR_PATH}; ${path.join(__dirname, '../../bin/mkcert')} ${config.domain}`);
            console.log(result.toString());
        }

        if (process.platform === 'win32') {
            const result = execSync(
                `cd ${CERTS_DIR_PATH} & ${path.join(__dirname, '..\\..\\bin\\mkcert.exe')} ${config.domain}`
            );
            console.log(result.toString());
        }
    }
};
