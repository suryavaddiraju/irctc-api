import {execFile} from "node:child_process";
import { fileURLToPath } from 'node:url';
import {readdirSync} from "node:fs";
import { dirname,join } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path_l = join(__dirname, "..","bin");
const files = readdirSync(path_l);
const args = process.argv.slice(2);
let path_n = "";
if (files.length === 0) {
    throw new Error("Platform not supported, Request you to manually download the viu binary file from rust standard installation page and place it inside this bin folder located in. "+path_l)
}
else{
    path_n = files[0];
}
const binaryPath = join(path_l, path_n);
execFile(binaryPath,args, (error, stdout, stderr) => {
    stdout: console.log(stdout);
    stderr: console.error(stderr);
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
});