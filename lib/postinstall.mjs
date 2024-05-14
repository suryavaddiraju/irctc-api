import {existsSync,chmodSync} from "node:fs";
let package_name = "";
if (!existsSync("./bin")) {
    throw new Error("Platform not supported, Request to manually download the viu from rust standard installation page and place it in your system environment variables.")
}
if (process.platform==='win32'&& process.arch==='x64'){
    package_name = "./bin/viu.exe";
}
else{
    package_name = "./bin/viu";
}
if (!existsSync(package_name)){
    throw new Error("Platform not supported, Request to manually download the viu from rust standard installation page and place it in your system environment variables.")
}
else{
    chmodSync(package_name, 0o755);
}