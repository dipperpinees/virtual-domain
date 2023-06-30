import sudo from 'sudo-prompt';
import fs from 'fs';
import configs from '../configs';

export default () => {
    const platform = process.platform;
    const hostsPath = platform === 'win32' ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts';
    const hostsData = fs.readFileSync(hostsPath, 'utf8');

    const applicationOptions = {
        name: 'My Application',
    };
    const listOfCommands: string[] = [];
    configs.getAll().forEach(config => {
        const newEntry = `${config.localIP} ${config.domain}`;
        if (hostsData.includes(newEntry)) return;
        listOfCommands.push(`echo ${newEntry} >> ${hostsPath}`);
    })

    if (!listOfCommands.length) {
        return;
    }

    sudo.exec(listOfCommands.join('&'), applicationOptions, function (error, stdout, stderr) {
        if (error) {
            console.error(stderr);
            process.exit(1);
        } else {
            console.log(stdout);
        }
    });
};
