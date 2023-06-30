declare module 'redbird' {
    interface Argument {
        port: number;
        ssl: {
            port: number;
        }    
    }
    
    interface Proxy {
        register: (domain: string, host: string, options: {
            ssl: {
                port: number,
                key: string,
                cert: string
            }
        }) => void
    }
    
    function redbird(args: Argument): Proxy;

    export default redbird;
}