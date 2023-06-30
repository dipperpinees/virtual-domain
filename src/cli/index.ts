import { Command } from 'commander';
import commandHandler from './commands';

export default () => {
    const program = new Command();
    commandHandler(program);

    program.parse();
};
