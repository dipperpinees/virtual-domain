import { execSync } from 'child_process';
import fs from 'fs';
import configs from '../configs';
import path from 'path';

const certFolderPath = path.join(__dirname, "../../certs");

const checkExists = (domain: string) => {
    const certPart = path.join(certFolderPath, `./${domain}.pem`);
    const keyPart = path.join(certFolderPath, `./${domain}-key.pem`);
    if (fs.existsSync(certPart) && fs.existsSync(keyPart)) {
        const stats = fs.statSync(certPart);
        const fileCreatedTime = stats.ctime.getTime();
        if (new Date().getTime() - fileCreatedTime < 3 * 30 * 24 * 60 * 60 * 1000) return true;
    }

    return false;
};

export default () => {
    if (!fs.existsSync(certFolderPath)) {
        fs.mkdirSync(certFolderPath);
    }
    for (const config of configs.getAll()) {
        if (checkExists(config.domain)) continue;
        if (process.platform === 'linux') {
            const result = execSync(`cd ${certFolderPath} & ./bin/mkcert ${config.domain}`);
            console.log(result.toString());
        }

        if (process.platform === 'win32') {
            const result = execSync(`cd ${certFolderPath} & ..\\bin\\mkcert.exe ${config.domain}`);
            console.log(result.toString());
        }
    }
};