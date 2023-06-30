import { execSync } from 'child_process';
import fs from 'fs';
import configs from '../configs';

const checkExists = (domain: string) => {
    const certPart = `certs/${domain}.pem`;
    const keyPart = `certs/${domain}-key.pem`;
    if (fs.existsSync(certPart) && fs.existsSync(keyPart)) {
        const stats = fs.statSync(certPart);
        const fileCreatedTime = stats.ctime.getTime();
        if (new Date().getTime() - fileCreatedTime < 3 * 30 * 24 * 60 * 60 * 1000) return true;
    }

    return false;
};

export default () => {
    if (!fs.existsSync('certs')) {
        fs.mkdirSync('certs');
    }
    for (const config of configs.getAll()) {
        if (checkExists(config.domain)) continue;
        const result = execSync(`mkcert ${config.domain}`);
        console.log(result.toString());
        createCert(config.domain);
    }
};

export const createCert = (domain: string) => {
    fs.rename(`${domain}-key.pem`, `certs/${domain}-key.pem`, (err) => {
        if (err) console.error(err);
    });
    fs.rename(`${domain}.pem`, `certs/${domain}.pem`, (err) => {
        if (err) console.error(err);
    });
};
