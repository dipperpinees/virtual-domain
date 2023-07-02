import colors from 'colors';
import { startServer, stopServer } from '../../server';
import fs from 'fs';
import { isPortReachable } from '../../utils/portProcess';

export const start = async () => {
    try {
        await startServer();
        console.log(colors.green('Start server successfully'));
    } catch (err) {
        let errorMessage = 'Failed to start server';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const stop = async () => {
    try {
        await stopServer();
        console.log(colors.green('Stop server successfully'));
    } catch (err) {
        let errorMessage = 'Failed to stop server';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const readLogs = () => {
    try {
        const data = fs.readFileSync('logs.txt', 'utf8');
        console.log(data);
    } catch (err) {
        let errorMessage = 'Failed to read server logs';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};

export const getStatus = async () => {
    try {
        const status = await isPortReachable(80);
        console.log(status ? colors.green("Running") : colors.red("Stopped"))
    } catch (err) {
        let errorMessage = 'Failed to get status';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
        process.exit(1);
    }
};
