import { spawn } from 'child_process';
import getBinPathTarget from '../get-bin-target';

const getTunnelUrl = (data: string) => {
    const startUrl = "https://";
    const endUrl = ".trycloudflare.com";
    if (data.includes(startUrl) && data.includes(endUrl)) {
        return data.substring(data.indexOf(startUrl), data.indexOf(endUrl) + endUrl.length)
    }
}

export default function useCloudflareTunnel(port: number):Promise<string> {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(`${getBinPathTarget()}`, ['tunnel', '--url', `http://localhost:${port}`], {shell: true});

        const handleStd = (data: Buffer) => {
            const tunnelUrl = getTunnelUrl(`${data}`);
            if (tunnelUrl) resolve(tunnelUrl)
        }

        childProcess.stdout.on('data', handleStd);

        childProcess.stderr.on('data', handleStd);

        childProcess.unref();
    })
}