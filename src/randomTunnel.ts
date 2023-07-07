import useCloudflareTunnel from './cloudflare';
import useNgrokTunnel from './ngrok';
import fs from 'fs';
import path from 'path';
import promptSync from 'prompt-sync';
import ngrok from 'ngrok';

const prompt = promptSync();

export default async function useRandomTunnel({
    port,
    authNgrokToken,
    ngrokRegion,
}: {
    port: number;
    authNgrokToken?: string;
    ngrokRegion?: ngrok.Ngrok.Region;
}) {
    const randomNumber = Math.floor(Math.random() * 2);

    // use cloudflare
    if (randomNumber === 0) {
        return useCloudflareTunnel(port);
    }

    if (!authNgrokToken) {
        const SAVED_NGROK_TOKEN_PATH = path.join(__dirname, 'ngrok_token.txt');
        authNgrokToken = fs.existsSync(SAVED_NGROK_TOKEN_PATH)
            ? fs.readFileSync(SAVED_NGROK_TOKEN_PATH, { encoding: 'utf8' })
            : '';
    }

    if (!authNgrokToken) {
        authNgrokToken = prompt('Enter your NGROK token: ');
    }

    return useNgrokTunnel({
        authtoken: authNgrokToken,
        port,
        region: ngrokRegion,
    });
}
