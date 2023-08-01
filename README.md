# Shopify App Tunnel
A simple npm package to run Cloudflare or ngrok tunnel for Shopify apps in Node.js.

## Installation
Using npm:
```bash
$ npm install --save-dev @bss-sbc/tunnel
```

Using yarn:
```bash
$ yarn add -D @bss-sbc/tunnel
```

## Usage
Using Cloudflare tunnel:
```javascript
const { useCloudflareTunnel } = require("@bss-sbc/tunnel");
(async () => {
  const tunnelUrl = await useCloudflareTunnel(8001);
  console.log("Tunnel url: ", tunnelUrl)
}) ()
```

Using ngrok tunnel:
```javascript
const { useNgrokTunnel } = require("@bss-sbc/tunnel");
(async () => {
  const tunnelUrl = await useNgrokTunnel({
    port: 8001,
    authtoken: "", // optional, if the field is undefined, an input promt will appear to enter the token and store it for later use.
    region: "jp" // optional, default is "jp"
  });
  console.log("Tunnel url: ", tunnelUrl)
}) ()
```

Using SSH tunnel:
```javascript
const { useSSHTunnel } = require("@bss-sbc/tunnel");
(async () => {
  await useSSHTunnel({
    sshConfig: {
      host: '192.168.100.100',
      port: 22,
      username: 'frylock',

      // with private key
      privateKey: readFileSync('/path/to/my/key'),

      // with password
      password: 'nodejsrules'
    },
    remoteHost: '127.0.0.1', // optional, default is "127.0.0.1"
    localHost: '127.0.0.1', // optional, default is "127.0.0.1"
    remotePort: 3000,
    localPort: 3000
  });
}) ()
```

## References:
- <a href="https://shopify.dev/">Shopify Developer Documentation - Shopify's official developer documentation.</a>
- <a href="https://www.cloudflare.com/">Cloudflare - Cloudflare's official website.</a>
- <a href="https://ngrok.com/">ngrok's official website.</a>

