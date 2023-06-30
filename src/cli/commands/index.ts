import configsCommand from './configs';
import serverCommand from './server';
import { Command } from 'commander';

export default (program: Command) => {
    configsCommand(program);
    serverCommand(program);
};