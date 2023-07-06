import path from "path";
import os from "os";

const HOMEDIR = (process.platform === "linux" && process.env.SUDO_USER) ? `/home/${process.env.SUDO_USER}` : os.homedir();

export const CONFIGS_PATH = path.join(HOMEDIR, "./.bss-configs.json");
export const CERTS_DIR_PATH = path.join(HOMEDIR, "./.bss-certs");
export const LOGS_PATH = path.join(HOMEDIR, "./bss-logs.txt");