import Table from 'cli-table';
import colors from 'colors';
import {configs} from '../../configs';
import { IConfig } from '../../types/config';

export const create = async (domain: string, options: { ip?: string; port: number }) => {
    if (!options.port) {
        console.error(colors.red('PORT cannot be left blank'));
        process.exit(1);
    }
    try {
        const newConfig: IConfig = {
            domain,
            port: options.port,
            localIP: options.ip || '127.0.0.1',
            status: true,
        };
        configs.add(newConfig);
        console.log(colors.green('Create config successfully'));
        display();
    } catch (err) {
        let errorMessage = 'Failed to create config';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const update = async (domain: string, options: { ip?: string; port: number }) => {
    if (!options.port) {
        console.error(colors.red('PORT cannot be left blank'));
        process.exit(1);
    }
    try {
        const updateConfig: IConfig = {
            domain,
            port: options.port,
            localIP: options.ip || '127.0.0.1',
            status: true,
        };
        configs.update(updateConfig);
        console.log(colors.green('Update config successfully'));
        display();
    } catch (err) {
        let errorMessage = 'Failed to update config';
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
            configs.removeByDomain(str);
        }
        console.log(colors.green(`Delete ${str} successfully`));
        display();
    } catch (err) {
        let errorMessage = 'Failed to remove config';
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
            configs.startByDomain(str);
        }
        console.log(colors.green(`Enable ${str} successfully`));
        display();
    } catch (err) {
        let errorMessage = 'Failed to enable config';
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
            configs.stopByDomain(str);
        }
        console.log(colors.green(`Disable ${str} successfully`));
        display();
    } catch (err) {
        let errorMessage = 'Failed to disable config';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const display = () => {
    const table = new Table({
        head: ['ID', 'Host', 'Status', 'LocalIP', 'Port'],
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
            .map(({ id, status, domain, localIP, port }) => [
                `${id}`,
                domain,
                status ? 'enabled' : 'disabled',
                localIP,
                `${port}`,
            ])
    );
    console.log(table.toString());
};
