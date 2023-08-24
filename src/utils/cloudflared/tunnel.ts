import { exec, spawn } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import path from 'path';
import util from 'util';
import { IConfig } from '../../interfaces/cloudflared';
import getBinPathTarget from '../get-bin-target';
import { configSchema } from './schema';
const execPromise = util.promisify(exec);

export default class CloudflareTunnel {
    config: IConfig;
    TIME_OUT: number = 20000;
    CONFIG_PATH: string = path.join(__dirname, '../../../config.yaml');
    BIN_PATH: string = getBinPathTarget();
    tunnelID?: string;
    credentialPath?: string;

    constructor(_config: IConfig) {
        const { error } = configSchema.validate(_config);
        if (error) {
            throw new Error(JSON.stringify(error.details));
        }
        this.config = _config;
    }

    private createConfig() {
        let configContent = `tunnel: ${this.config.tunnelName}\ncredentials-file: ${this.credentialPath}\n`;
        if (this.config.tunnelOptions && Object.keys(this.config.tunnelOptions).length) {
            configContent += `originRequest:\n`;
            Object.keys(this.config.tunnelOptions).forEach(key => {
                configContent += `  ${key}: ${this.config.tunnelOptions?.[key]}\n`
            })
        }
        
        configContent += 'ingress:\n';
        this.config.tunnels.forEach(({hostname, service}) => {
            configContent += `  - hostname: ${hostname}\n    service: ${service}\n`;
        })
        configContent += `  - service: http_status:404`;
        writeFileSync(this.CONFIG_PATH, configContent);
    }

    private async createDNSRecord() {
        try {
            for (const { hostname } of this.config.tunnels) {
                await execPromise(`${this.BIN_PATH} tunnel route dns --overwrite-dns ${this.tunnelID} ${hostname}`, {
                    env: {
                        TUNNEL_ORIGIN_CERT: this.config.certPath,
                        NO_AUTOUPDATE: 'true',
                    },
                });
            }
        } catch (err) {
            if (`${err}`.includes('ERR')) throw err;
        }
    }

    private async createTunnel() {
        const { stdout } = await execPromise(`${this.BIN_PATH} tunnel create ${this.config.tunnelName}`, {
            env: {
                TUNNEL_ORIGIN_CERT: this.config.certPath,
                TUNNEL_CREATE_SECRET: this.config.cfSecretKey,
                NO_AUTOUPDATE: 'true',
            },
        });
        return stdout.split(' ').slice(-1)[0].trim();
    }

    private async getTunnelID() {
        const { stdout } = await execPromise(`${this.BIN_PATH} tunnel list`, {
            env: {
                TUNNEL_ORIGIN_CERT: this.config.certPath,
                NO_AUTOUPDATE: 'true',
            },
        });
        const tunnelDataList = stdout.split(/(\s+)/).filter((data) => data.trim().length > 0);
        const tunnelIndex = tunnelDataList.indexOf(this.config.tunnelName);
        return tunnelDataList[tunnelIndex - 1]?.trim();
    }

    private createCredetials() {
        this.credentialPath = path.join(path.dirname(this.config.certPath), `${this.tunnelID}.json`);
        if (!existsSync(this.credentialPath)) {
            writeFileSync(
                this.credentialPath,
                JSON.stringify({
                    AccountTag: this.config.cfAccountTag,
                    TunnelSecret: this.config.cfSecretKey,
                    TunnelID: this.tunnelID,
                })
            );
        }
    }

    private createTunnelConnection() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('ERR_CONNECTION_TIMED_OUT'));
            }, this.TIME_OUT);
            const childProcess = spawn(`${getBinPathTarget()}`, ['tunnel', '--config', this.CONFIG_PATH, 'run'], {
                shell: true,
                env: {
                    TUNNEL_ORIGIN_CERT: this.config.certPath,
                    NO_AUTOUPDATE: 'true',
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

    public async start() {
        this.tunnelID = await this.getTunnelID();
        if (!this.tunnelID) {
            this.tunnelID = await this.createTunnel();
        }

        await this.createDNSRecord();
        this.createCredetials();
        this.createConfig();
        this.createTunnelConnection();
    }
}
