import { Client, ConnectConfig } from 'ssh2';
import net from "net";

interface ISSHTunnel {
    sshConfig: ConnectConfig;
    remoteHost?: string,
    remotePort: number,
    localPort: number;
    localHost?: string;
}

export default async function useSSHTunnel({sshConfig, localPort, localHost = '127.0.0.1', remotePort, remoteHost = "127.0.0.1"}: ISSHTunnel) {
    const conn = new Client();
    conn.on('ready', () => {
        conn.forwardIn(remoteHost, remotePort, (err) => {
            if (err) throw err;
            console.log(`Listening for connections on server on port ${remotePort}!`);
        })
    }).on("tcp connection", (info, accept) => {
        const stream = accept();
        stream.pause();

        const localServer = net.createConnection({port: localPort, host: localHost}, () => {
            stream.pipe(localServer);
            localServer.pipe(stream);
            stream.resume();
        });
    }).connect(sshConfig);
}