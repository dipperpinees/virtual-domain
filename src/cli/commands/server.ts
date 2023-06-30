import { serverHandler } from "../handlers";
import { Command } from 'commander';

export default (program: Command) => {
    program.command('start').description('Start server').action(serverHandler.start);
    program.command('stop').description('Stop server').action(serverHandler.stop);
};
