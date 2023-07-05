# Node.js Virtual Host Command Line Tool
## Introduction
The Node.js Virtual Host Command Line Tool is a powerful utility that allows you to create virtual domains and SSL certificates for running Shopify apps on your local environment. This command line tool simplifies the process of setting up a virtual domain with SSL, enabling you to test and develop your Shopify app seamlessly on your local machine.

# Installation
```bash
  npm install -g @bss/virtual-host
```

# Command
## Display the list of virtual host config
```
  USAGE
  $ virtual-host list

  EXAMPLES
  $ virtual-host list
  ╔════╤═══════════════════════════════════════════╤═════════╤═══════════╤══════╗
  ║ ID │ Host                                      │ Status  │ LocalIP   │ Port ║
  ╟────┼───────────────────────────────────────────┼─────────┼───────────┼──────╢
  ║ 0  │ hiepnk.com                                │ enabled │ 127.0.0.1 │ 3001 ║
  ╚════╧═══════════════════════════════════════════╧═════════╧═══════════╧══════╝
```

## Add new virtual host config
```
  USAGE
  $ virtual-host add [options] <domain>

  ARGUMENTS:
  domain         virtual domain to add

  OPTIONS
     -i, --ip    local host ip, default is 127.0.0.1
     -p, --port  local host port

  EXAMPLES
  $ virtual-host add hiepnk.com -p 3001 -i 127.0.0.1
```

## Update config
```
  USAGE
  $ virtual-host update [options] <domain>

  ARGUMENTS:
  domain         virtual domain to update

  OPTIONS
     -i, --ip    local host ip, default is 127.0.0.1
     -p, --port  local host port

  EXAMPLES
  $ virtual-host update hiepnk.com -p 3003
```

## Enable config
```
  USAGE
  $ virtual-host enable <args>

  ARGUMENTS:
  args           config id or domain 
```

## Disable config
```
  USAGE
  $ virtual-host disable <args>

  ARGUMENTS:
  args           config id or domain 
```

## Delete config
```
  USAGE
  $ virtual-host rm <args>

  ARGUMENTS:
  args         config id or domain 

  EXAMPLES
  $ virtual-host rm hiepnk.com
  $ virtual-host rm 0
```

## Start or restart virtual host server
```
  USAGE
  $ virtual-host start
```

## Stop virtual host server
```
  USAGE
  $ virtual-host stop
```

## Check virtual host server status
```
  USAGE
  $ virtual-host status

  EXAMPLES
  $ virtual-host status
    Running
```

## License

[MIT](LICENSE)
