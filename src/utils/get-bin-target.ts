import path from "path";

export default function getBinPathTarget () {
    return path.join(__dirname, `../../bin/${process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared'}`)
}
