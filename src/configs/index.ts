import fs from 'fs';
import { IConfig } from '../types/config';

class Configs {
    data: IConfig[];
    constructor() {
        try {
            this.data = JSON.parse(fs.readFileSync('configs.json', 'utf8'));
        } catch (err) {
            this.data = []
        }
    }

    getAll() {
        return this.data;
    }

    getEnable() {
        return this.data.filter((config) => config.status);
    }

    add(config: IConfig) {
        if (this.data.find(({ name }) => name === config.name)) {
            throw new Error('This name already exists');
        }
        if (this.data.find(({ domain }) => domain === config.domain)) {
            throw new Error('This domain already exists');
        }
        const lastConfig = this.data[this.data.length - 1];
        if (lastConfig && lastConfig.id !== undefined) {
            config.id = lastConfig.id + 1;
        } else {
            config.id = 0
        }
        this.data.push(config);
        this.update();
    }

    removeByID(id: number) {
        const config = this.data.find((config) => config.id === id);
        if (!config) throw new Error(`Config ${id} not found`);
        this.data.splice(this.data.indexOf(config), 1);
        this.update();
    }

    removeByName(name: string) {
        const config = this.data.find((config) => config.name === name);
        if (!config) throw new Error(`Config ${name} not found`);
        this.data.splice(this.data.indexOf(config), 1);
        this.update();
    }

    startByID(id: number) {
        const config = this.data.find((config) => config.id === id);
        if (!config) throw new Error(`Config ${id} not found`);
        config.status = true;
        this.update();
    }

    startByName(name: string) {
        const config = this.data.find((config) => config.name === name);
        if (!config) throw new Error(`Config ${name} not found`);
        config.status = true;
        this.update();
    }

    stopByID(id: number) {
        const config = this.data.find((config) => config.id === id);
        if (!config) throw new Error(`Config ${id} not found`);
        config.status = false;
        this.update();
    }

    stopByName(name: string) {
        const config = this.data.find((config) => config.name === name);
        if (!config) throw new Error(`Config ${name} not found`);
        config.status = false;
        this.update();
    }

    update() {
        fs.writeFileSync('configs.json', JSON.stringify(this.data));
    }
}

export default new Configs();
