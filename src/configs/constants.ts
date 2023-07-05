import path from "path";
import os from "os";

export const CONFIGS_PATH = path.join(os.homedir(), ".bss-configs.json");
export const CERTS_DIR_PATH = path.join(os.homedir(), "./.bss-certs");
export const LOGS_PATH = path.join(os.homedir(), "./bss-logs.txt");