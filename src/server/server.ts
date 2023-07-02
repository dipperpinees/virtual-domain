import redbird from 'redbird';
import configs from '../configs';

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
            port: 8443,
            key: `./certs/${config.domain}-key.pem`,
            cert: `./certs/${config.domain}.pem`,
        },
    });
}
