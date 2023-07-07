# Shopify App Tunnel
A simple npm package to run Cloudflare or ngrok tunnel for Shopify apps in Node.js.

## Installation
Using npm:
```bash
$ npm install --save-dev @bsscommerce/tunnel
```

Using yarn:
```bash
$ yarn add -D @bsscommerce/tunnel
```

## Usage
Using Cloudflare tunnel:
```javascript
const {useCloudflareTunnel} = require("@bsscommerce/tunnel");
(async () => {
  const tunnelUrl = await useCloudflareTunnel(8001);
  console.log("Tunnel url: ", tunnelUrl)
}) ()
```

Using ngrok tunnel:
```javascript
const {useNgrokTunnel} = require("@bsscommerce/tunnel");
(async () => {
  const tunnelUrl = await useNgrokTunnel({
    port: 8001,
    authtoken: "", // optional, if the field is undefined, an input promt will appear to enter the token and store it for later use.
    region: "jp" // optional, default is "jp"
  });
  console.log("Tunnel url: ", tunnelUrl)
}) ()
```

## References:
- <a href="https://shopify.dev/">Shopify Developer Documentation - Shopify's official developer documentation.</a>
- <a href="https://www.cloudflare.com/">Cloudflare - Cloudflare's official website.</a>
- <a href="https://ngrok.com/">ngrok's official website.</a>

