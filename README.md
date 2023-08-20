# Shopify App Tunnel
A simple npm package to run Cloudflare tunnel for Shopify apps in Node.js.

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
Using Cloudflare quick tunnel:
```javascript
const { useCloudflareQuickTunnel } = require("@bss-sbc/tunnel");
(async () => {
  const tunnelUrl = await useCloudflareQuickTunnel(8001);
  console.log("Tunnel url: ", tunnelUrl)
}) ()
```

Using Cloudflare Zero Trust:
```javascript
const { CloudflareTunnel } = require("@bss-sbc/tunnel");

const cfTunnel = new CloudflareTunnel({
  certPath: 'home/hiepnguyen/.cloudflared/cert.pem',
  credentialsPath: 'home/hiepnguyen/.cloudflared/abc-def.json',
  hostname: 'foo.bar.com',
  service: 'http://localhost:3000',
  cfArgoName: 'foo',
  debug: true,
  unref: true
})

cfTunnel.start();
```


## References:
- <a href="https://shopify.dev/">Shopify Developer Documentation - Shopify's official developer documentation.</a>
- <a href="https://www.cloudflare.com/">Cloudflare - Cloudflare's official website.</a>

