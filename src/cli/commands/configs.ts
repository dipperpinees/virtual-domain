import { configsHandler } from "../handlers";
import { Command } from 'commander';

export default (program: Command) => {
    program.command('list').description('Show list configs').action(configsHandler.display);

    program.command('rm').description('Remove config').argument('<id | name>', 'Id to delete').action(configsHandler.remove);

    program.command('enable').description('Start config').argument('<id | name>', 'Id to start').action(configsHandler.enable);

    program.command('disable').description('Stop config').argument('<id | name>', 'Id to stop').action(configsHandler.disable);

    program
        .command('add')
        .description('Add config')
        .argument('domain', 'Virtual domain')
        .option('-i, --ip <value>')
        .option('-p, --port <value>')
        .action(configsHandler.create);

    program
        .command('update')
        .description('Update config')
        .argument('domain', 'Virtual domain')
        .option('-i, --ip <value>')
        .option('-p, --port <value>')
        .action(configsHandler.update);
};
