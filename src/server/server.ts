import redbird from 'redbird';
import path from 'path';
import {CERTS_DIR_PATH, configs} from '../configs';

if (!configs.getEnable().length) {
    process.exit(0);
}

const proxy = redbird({
    port: 80,
    ssl: {
        port: 443,
    },
});

for (const config of configs.getEnable()) {
    proxy.register(config.domain, `http://${config.localIP}:${config.port}`, {
        ssl: {
            port: 443,
            key: path.join(CERTS_DIR_PATH, `./${config.domain}-key.pem`),
            cert: path.join(CERTS_DIR_PATH, `./${config.domain}.pem`),
        },
    });
}
