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
const { useCloudflareTunnel } = require("@bss-sbc/tunnel");
(async () => {
  const tunnelUrl = await useCloudflareTunnel(8001);
  console.log("Tunnel url: ", tunnelUrl)
}) ()
```

Using Cloudflare Zero Trust:
```javascript
const { CloudflareTunnel } = require("@bss-sbc/tunnel");

const cfTunnel = new CloudflareTunnel({
  certPath: 'home/bar/.cloudflared/cert.pem',
  cfAccountTag: 'daca032c1f89e3d5gfdg34dfg',
  cfSecretKey: "k5meSe4CiZhC5IyJjDKOfsdxcvzbMGsVl66FK6CryWgQ=",
  tunnelName: "my-tunnel",
  tunnelOptions: {
      connectTimeout: "25s",
  },
  tunnels: [
      {
          hostname: "abc.example.com",
          service: "http://localhost:3000"
      },
      {
          hostname: "bcd.example.com",
          service: "http://localhost:3001"
      }
  ],
  debug: true
})

cfTunnel.start();
```


## References:
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide">Cloudflare Zero Trust</a>

