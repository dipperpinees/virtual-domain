import ngrok from 'ngrok';

export default async function useNgrokTunnel({
    authtoken,
    port,
    region = 'jp',
}: {
    authtoken: string;
    port: number;
    region?: ngrok.Ngrok.Region;
}) {
    return await ngrok.connect({
        authtoken: authtoken,
        addr: port,
        region,
    });
}
