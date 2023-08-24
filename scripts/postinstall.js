const path = require('path')
const util = require('util')
const {pipeline} = require('stream')
const {execSync} = require('child_process')
const {chmodSync, existsSync, mkdirSync, renameSync, unlinkSync, createWriteStream} = require('fs')
require("isomorphic-fetch");

const CLOUDFLARE_VERSION = '2023.8.0'
const CLOUDFLARE_REPO = `https://github.com/cloudflare/cloudflared/releases/download/${CLOUDFLARE_VERSION}/`

const LINUX_URL = {
  arm64: 'cloudflared-linux-arm64',
  arm: 'cloudflared-linux-arm',
  x64: 'cloudflared-linux-amd64',
  ia32: 'cloudflared-linux-386',
}

const MACOS_URL = {
  arm64: 'cloudflared-darwin-amd64.tgz',
  x64: 'cloudflared-darwin-amd64.tgz',
}

const WINDOWS_URL = {
  x64: 'cloudflared-windows-amd64.exe',
  ia32: 'cloudflared-windows-386.exe',
}

const URL = {
  linux: CLOUDFLARE_REPO + LINUX_URL[process.arch],
  darwin: CLOUDFLARE_REPO + MACOS_URL[process.arch],
  win32: CLOUDFLARE_REPO + WINDOWS_URL[process.arch],
}


function getBinPathTarget() {
  return path.join(
    __dirname,
    `../bin/${process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared'}`,
  )
}

async function install() {
  const fileUrlPath = URL[process.platform]
  if (fileUrlPath === undefined) {
    throw new Error(`Unsupported system platform: ${process.platform} or arch: ${process.arch}`)
  }

  const binTarget = getBinPathTarget()

  if (process.platform === 'linux') {
    await installLinux(fileUrlPath, binTarget)
  } else if (process.platform === 'darwin') {
    await installMacos(fileUrlPath, binTarget)
  } else if (process.platform === 'win32') {
    await installWindows(fileUrlPath, binTarget)
  } else {
    throw new Error(`Unsupported platform: ${process.platform}`)
  }
}

async function installLinux(file, binTarget) {
  await downloadFile(file, binTarget)
  chmodSync(binTarget, '755')
}

async function installWindows(file, binTarget) {
  await downloadFile(file, binTarget)
}

async function installMacos(file, binTarget) {
  await downloadFile(file, `${binTarget}.tgz`)
  const filename = path.basename(`${binTarget}.tgz`)
  execSync(`tar -xzf ${filename}`, {cwd: path.dirname(binTarget)})
  unlinkSync(`${binTarget}.tgz`)
  renameSync(`${path.dirname(binTarget)}/cloudflared`, binTarget)
}

async function downloadFile(url, to) {
  if (existsSync(to)) {
    return to;
  }
  if (!existsSync(path.dirname(to))) {
    mkdirSync(path.dirname(to))
  }
  const streamPipeline = util.promisify(pipeline)
  const response = await fetch(url, {redirect: 'follow'})
  if (!response.ok) throw new Error("Couldn't download file")
  const fileObject = createWriteStream(to)
  await streamPipeline(response.body, fileObject)
  return to
}

install().catch((err) => {
  throw err
})
