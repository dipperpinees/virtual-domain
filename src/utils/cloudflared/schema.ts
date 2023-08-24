import Joi from 'joi';
import { IConfig, ITunnelOptions } from '../../interfaces/cloudflared';

const tunnelOptionsSchema = Joi.object<ITunnelOptions>({
    access: Joi.string().optional(),
    connectTimeout: Joi.string().optional(),
    noTLSVerify: Joi.string().optional(),
    http2Origin: Joi.string().optional(),
    tcpKeepAlive: Joi.string().optional(),
    noHappyEyeballs: Joi.string().optional(),
    keepAliveConnections: Joi.string().optional(),
    keepAliveTimeout: Joi.string().optional(),
    httpHostHeader: Joi.string().optional(),
    originServerName: Joi.string().optional(),
    caPool: Joi.string().optional(),
    disableChunkedEncoding: Joi.string().optional(),
    proxyAddress: Joi.string().optional(),
    proxyPort: Joi.string().optional(),
    proxyType: Joi.string().optional(),
}).unknown(false);

export const configSchema = Joi.object<IConfig>({
    cfAccountTag: Joi.string().alphanum().min(3).max(40).required(),
    cfSecretKey: Joi.string().min(32).required(),
    certPath: Joi.string().required(),
    unref: Joi.boolean(),
    debug: Joi.boolean(),
    tunnelName: Joi.string()
        .regex(/^[a-zA-Z0-9\-]+$/)
        .min(3)
        .max(40)
        .required(),
    tunnels: Joi.array().items(
        Joi.object({
            hostname: Joi.string().required(),
            service: Joi.string().uri().required(),
        })
    ),
    tunnelOptions: tunnelOptionsSchema.optional(),
});
