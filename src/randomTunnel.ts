import useCloudflareTunnel from './cloudflare';
import useNgrokTunnel from './ngrok';
import ngrok from 'ngrok';

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

    // use ngrok
    return useNgrokTunnel({
        authtoken: authNgrokToken,
        port,
        region: ngrokRegion,
    });
}
