import Table from 'cli-table';
import colors from 'colors';
import configs from "../../configs";
import { startServer } from "../../server";
import { IConfig } from '../../types/config';

export const create = async (str: string, options: {ip?: string, port: number, domain: string}) => {
    if (!options.domain) {
        console.error(colors.red('DOMAIN cannot be left blank'));
        process.exit(1);
    }
    if (!options.port) {
        console.error(colors.red('PORT cannot be left blank'));
        process.exit(1);
    }
    try {
        const newConfig: IConfig = {
            name: str,
            domain: options.domain,
            port: options.port,
            localIP: options.ip || '127.0.0.1',
            status: true,
        }
        configs.add(newConfig);
        await startServer();
        console.log(colors.green('Create config successfully'));
        display();
    } catch (err) {
        let errorMessage = "Failed to create config";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const remove = async (str: string) => {
    try {
        if (/^\d+$/.test(str)) {
            configs.removeByID(parseInt(str));
        } else {
            configs.removeByName(str);
        }
        await startServer();
        console.log(colors.green(`Delete ${str} successfully`));
        display();
    } catch (err) {
        let errorMessage = "Failed to remove config";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const enable = async (str: string) => {
    try {
        if (/^\d+$/.test(str)) {
            configs.startByID(parseInt(str));
        } else {
            configs.startByName(str);
        }
        await startServer();
        console.log(colors.green(`Enable ${str} successfully`));
        display();
    } catch (err) {
        let errorMessage = "Failed to enable config";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const disable = async (str: string) => {
    try {
        if (/^\d+$/.test(str)) {
            configs.stopByID(parseInt(str));
        } else {
            configs.stopByName(str);
        }
        await startServer();
        console.log(colors.green(`Disable ${str} successfully`));
        display();
    } catch (err) {
        let errorMessage = "Failed to disable config";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const display = () => {
    const table = new Table({
        head: ['ID', 'Name', 'Status', 'Domain', 'LocalIP', 'Port'],
        chars: {
            top: '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            bottom: '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            left: '║',
            'left-mid': '╟',
            mid: '─',
            'mid-mid': '┼',
            right: '║',
            'right-mid': '╢',
            middle: '│',
        },
    });
    
    table.push(
        ...configs
            .getAll()
            .map(({ id, name, status, domain, localIP, port }) => [
                `${id}`,
                name,
                status ? 'enabled' : 'disabled',
                domain,
                localIP,
                `${port}`,
            ])
    );
    console.log(table.toString());
};
