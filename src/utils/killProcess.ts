import killPort from "kill-port";
import { isPortReachable } from "./portProcess";

export default async function killProcess(port: number) {
    const portStatus = await isPortReachable(port);
    if (portStatus) await killPort(port, "tcp");
}