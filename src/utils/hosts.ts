import sudo from 'sudo-prompt';
import fs from 'fs';
import { configs } from '../configs';

const getHostsPath = () => {
    switch (process.platform) {
        case "win32":
            return 'C:\\Windows\\System32\\drivers\\etc\\hosts'
        case "linux":
            return '/etc/hosts';
        default:
            console.error("Failed to add virtual host!!");
            process.exit(1);
    }
}

export default () => {
    const hostsPath = getHostsPath();
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
