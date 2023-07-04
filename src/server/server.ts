import redbird from 'redbird';
import configs from '../configs';
import path from 'path';

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
            key: path.join(__dirname, `../../certs/${config.domain}-key.pem`),
            cert: path.join(__dirname, `../../certs/${config.domain}.pem`),
        },
    });
}
