export interface ITunnelOptions {
    [key: string]: string;
};

export interface IHost {
    hostname: string;
    service: string;
}

export interface IConfig {
    cfAccountTag: string;
    cfSecretKey: string;
    certPath: string;
    tunnelName: string;
    tunnels: IHost[];
    tunnelOptions?: ITunnelOptions;
    unref?: boolean;
    debug?: boolean;
}
