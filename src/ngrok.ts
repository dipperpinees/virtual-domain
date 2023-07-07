import ngrok from 'ngrok';
import fs from 'fs';
import promptSync from 'prompt-sync';
import path from 'path';

const prompt = promptSync();
const SAVED_NGROK_TOKEN_PATH = path.join(__dirname, '../ngrok_token.txt');

export default async function useNgrokTunnel({
    authtoken,
    port,
    region = 'jp',
}: {
    authtoken?: string;
    port: number;
    region?: ngrok.Ngrok.Region;
}) {
    if (!authtoken) {
        authtoken = fs.existsSync(SAVED_NGROK_TOKEN_PATH)
            ? fs.readFileSync(SAVED_NGROK_TOKEN_PATH, { encoding: 'utf8' })
            : '';
    }

    if (!authtoken) {
        authtoken = prompt('Enter your NGROK token: ');
        fs.writeFileSync(SAVED_NGROK_TOKEN_PATH, authtoken);
    }
    
    return await ngrok.connect({
        authtoken,
        addr: port,
        region,
    });
}
