import { existsSync,writeFileSync,chmodSync,mkdirSync,readdirSync} from 'node:fs';
import {dirname,resolve as folder_resolver} from "node:path";
import { fileURLToPath } from 'node:url';
import {BROWSE} from "./browse.mjs";
const __dirname = dirname(fileURLToPath(import.meta.url));

function setviupath(params){
    return new Promise((resolve,reject) => {
        if (Object.prototype.hasOwnProperty.call(params, "viu") && params.viu && typeof params.viu === "string" && params.viu.length >2) {
            let viupath = folder_resolver(params.viu);
            if (existsSync(viupath)) {
                resolve(viupath);
            }else{
                viupath = "";
                reject(new Error("File not found: "+params.viu));
            }
        }
        else {
            const path_l = folder_resolver(__dirname, "..", "bin");
            if (!(existsSync(path_l))){
                try{
                    mkdirSync(path_l);
                }catch (err) {
                    reject(new Error(`Failed to create directory ${path_l}: ${err.message}`));
                }
            }
            const files = readdirSync(path_l);
            if (files.length === 0) {
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
                const url = `https://github.com/atanunq/viu/releases/download/v1.5.0/${package_name}`;
                const browser = new BROWSE();
                browser.request(url,{"method": "GET",}).then(({ body }) => {
                    writeFileSync(folder_resolver(path_l, offline_file), body);
                    chmodSync(folder_resolver(path_l, offline_file), 0o755);
                    resolve(folder_resolver(path_l, offline_file));
                })
                .catch((error) => {
                    reject(new Error(`Failed to GET ${url}: ${error.message}`));
                });
            } else if (files.length === 1 && (files[0].endsWith("viu.exe") || files[0].endsWith("viu"))) {
                resolve(folder_resolver(path_l, files[0]));
            }
            else{
                reject(new ReferenceError(`Multiple binary files or irrelevant files found. Please delete all the files present inside this "${path_l}" folder.`));
            }
        }
    });
}

export {setviupath as viupath};
export default setviupath;
