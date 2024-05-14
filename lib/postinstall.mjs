import * as fs from "node:fs";
import https from 'node:https';
let package_name = "";
let offline_file = "viu";
if (process.platform==='darwin'&& process.arch==='x64'){
    package_name = "viu-x86_64-apple-darwin"
}
else if (process.platform==='win32'&& process.arch==='x64'){
    package_name = "viu-x86_64-pc-windows-msvc.exe";
    offline_file = "viu.exe";
}
else if (process.platform==='linux'&& process.arch==='x64'){
    package_name = "viu-x86_64-unknown-linux-musl"
}
else if (process.platform==='linux'&& process.arch==='arm64'){
    package_name = "viu-aprocess.arch64-unknown-linux-musl"
}
else if (process.platform==='linux'&& process.arch==='arm' && process.config.variables.arm_version === 7){
    package_name = "viu-armv7-unknown-linux-musleabihf"
}
else if(process.platform==='linux'&& process.arch==='arm' && process.config.variables.arm_version !== 7){
    package_name = "viu-arm-unknown-linux-musleabihf"
}
else{
    throw new Error("Platform not supported, Request to manually download the viu fromrust standard installation page and place it in the bin folder.")
}
const url = `https://github.com/atanunq/viu/releases/latest/download/${package_name}`;
function download(url, dest) {
    const req = https.get(url);
    req.on('response', (res) => {
        if (res.statusCode === 200) {
            res.pipe(dest);
        }
        else if (res.statusCode === 302 || res.statusCode === 301) {
            download(res.headers.location, dest);
        }
        else{
            console.error('Failed to download:', res.statusCode, res.statusMessage);
        }
    });
};
if (!fs.existsSync("./bin")) {
    fs.mkdirSync("./bin");
}
const binaryPath = `./bin/${offline_file}`;
if (!fs.existsSync(binaryPath)) {
    fs.closeSync(fs.openSync(binaryPath, 'w'));
    const file = fs.createWriteStream(binaryPath);
    download(url,file);
    fs.chmodSync(binaryPath, 0o755);
};