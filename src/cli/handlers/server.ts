import colors from 'colors';
import { startServer, stopServer } from '../../server';

export const start = async () => {
    try {
        await startServer();
        console.log(colors.green('Start server successfully'));
    } catch (err) {
        let errorMessage = "Failed to start server";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
    }
};

export const stop = async () => {
    try {
        await stopServer();
        console.log(colors.green('Stop server successfully'));
    } catch (err) {
        let errorMessage = "Failed to stop server";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error(colors.red(errorMessage));
    }
};
