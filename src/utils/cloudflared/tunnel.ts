import { exec, spawn } from 'child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import getBinPathTarget from '../get-bin-target';
import util from 'util';

const execPromise = util.promisify(exec);

interface IConfig {
    cfAccountTag: string;
    cfSecretKey: string;
    certPath: string;
    unref?: boolean;
    hostname: string;
    service: string;
    debug?: boolean;
    credentialsPath: string;
}

export default class CloudflareTunnel {
    config: IConfig;
    TIME_OUT: number;
    CONFIG_PATH: string;
    BIN_PATH: string;
    DNS_TEMP_PATH: string;

    constructor(_config: IConfig) {
        this.config = _config;
        this.TIME_OUT = 20000;
        this.CONFIG_PATH = path.join(__dirname, '../../../config.yaml');
        this.BIN_PATH = getBinPathTarget();
        this.DNS_TEMP_PATH = path.join(__dirname, '../../../dns_temp.txt');
    }

    private createConfig() {
        writeFileSync(
            this.CONFIG_PATH,
            `tunnel: ${this.config.hostname}
credentials-file: ${this.config.credentialsPath}
ingress:
  - hostname: ${this.config.hostname}
    service: ${this.config.service}
  - service: ${this.config.service}
    originRequest:
      connectTimeout: 5s
      keepAlive: 25s
`
        );
    }

    private async createDNSRecord() {
        try {
            await execPromise(`${this.BIN_PATH} tunnel route dns --overwrite-dns ${this.config.hostname} ${this.config.hostname}`, {
                env: {
                    TUNNEL_ORIGIN_CERT: this.config.certPath,
                },
            });
        } catch (err) {
            if (`${err}`.includes('ERR')) throw err;
        }
    }

    async getTunnelID(name: string) {
        const {stderr, stdout} = await execPromise(`${this.BIN_PATH} tunnel list`, {
            env: {
                TUNNEL_ORIGIN_CERT: this.config.certPath,
            },
        });
        stdout.split(/(\s+)/).filter(data => data.trim().length > 0)
    }

    public async start() {
        this.createConfig();
        await this.createDNSRecord();

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('ERR_CONNECTION_TIMED_OUT'));
            }, this.TIME_OUT);
            const childProcess = spawn(`${getBinPathTarget()}`, ['tunnel', '--config', this.CONFIG_PATH, 'run'], {
                shell: true,
                env: {
                    TUNNEL_ORIGIN_CERT: this.config.certPath,
                },
            });

            const handleMessage = (message: string) => {
                if (this.config.debug) console.log(message);

                if (message.includes('Registered tunnel connection')) {
                    clearTimeout(timeout);
                    resolve('Create tunnel successfully');
                }

                if (message.includes('ERR') || message.includes('error')) {
                    clearTimeout(timeout);
                    reject(new Error(message));
                }
            };

            childProcess.stdout.on('data', (message) => handleMessage(`${message}`));
            childProcess.stderr.on('data', (message) => handleMessage(`${message}`));

            if (this.config.unref) childProcess.unref();
        });
    }
}
