const { execSync } = require('child_process');
const sudo = require('sudo-prompt');

const installForLinux = () => {
    const exec = (command) => {
        execSync(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`${error}`);
                return;
            }
            console.error(`${stderr}`);
        });
    };
    exec('curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"');
    exec('chmod +x mkcert-v*-linux-amd64');
    exec('sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert');
    exec('mkcert -install');
    console.log('Install mkcert successfully!!');
};

const installForWindows = () => {
    const options = {
        name: 'Installing mkcert',
    };
    sudo.exec(
        `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) & choco install mkcert & mkcert -install`,
        options,
        function (error, stdout, stderr) {
            if (error) {
                console.error(error.message);
                return;
            };
            console.log(stdout);
            console.error(stderr);
        }
    );
};

if (process.platform === 'linux') {
    installForLinux();
}

if (process.platform === 'win32') {
    installForWindows();
}
