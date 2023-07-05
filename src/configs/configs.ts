import fs from 'fs';
import { IConfig } from '../types/config';
import { CONFIGS_PATH } from './constants';

class Configs {
    data: IConfig[];
    constructor() {
        try {
            this.data = JSON.parse(fs.readFileSync(CONFIGS_PATH, 'utf8'));
        } catch (err) {
            this.data = [];
        }
    }

    getAll() {
        return this.data;
    }

    getEnable() {
        return this.data.filter((config) => config.status);
    }

    add(config: IConfig) {
        if (this.data.find(({ domain }) => domain === config.domain)) {
            throw new Error('This config already exists');
        }
        const lastConfig = this.data[this.data.length - 1];
        if (lastConfig && lastConfig.id !== undefined) {
            config.id = lastConfig.id + 1;
        } else {
            config.id = 0
        }
        this.data.push(config);
        this.updateFile();
    }

    update(config: IConfig) {
        const currentConfig = this.data.find(({ domain }) => domain === config.domain);
        if (currentConfig) {
            if (config.port === currentConfig.port) return;
            currentConfig.port = config.port;
            this.updateFile();
            return;
        }
        this.add(config);
    }

    removeByID(id: number) {
        const config = this.data.find((config) => config.id === id);
        if (!config) throw new Error(`Config ${id} not found`);
        this.data.splice(this.data.indexOf(config), 1);
        this.updateFile();
    }

    removeByDomain(domain: string) {
        const config = this.data.find((config) => config.domain === domain);
        if (!config) throw new Error(`Config ${domain} not found`);
        this.data.splice(this.data.indexOf(config), 1);
        this.updateFile();
    }

    startByID(id: number) {
        const config = this.data.find((config) => config.id === id);
        if (!config) throw new Error(`Config ${id} not found`);
        config.status = true;
        this.updateFile();
    }

    startByDomain(domain: string) {
        const config = this.data.find((config) => config.domain === domain);
        if (!config) throw new Error(`Config ${domain} not found`);
        config.status = true;
        this.updateFile();
    }

    stopByID(id: number) {
        const config = this.data.find((config) => config.id === id);
        if (!config) throw new Error(`Config ${id} not found`);
        config.status = false;
        this.updateFile();
    }

    stopByDomain(domain: string) {
        const config = this.data.find((config) => config.domain === domain);
        if (!config) throw new Error(`Config ${domain} not found`);
        config.status = false;
        this.updateFile();
    }

    updateFile() {
        fs.writeFileSync(CONFIGS_PATH, JSON.stringify(this.data));
    }
}

export default new Configs();
