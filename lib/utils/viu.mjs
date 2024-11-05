import { existsSync, writeFileSync, chmodSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BROWSE } from './browse.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function setviupath(params) {
    if (Object.prototype.hasOwnProperty.call(params, 'viu') && params.viu && typeof params.viu === 'string' && params.viu.length > 2) {
        const viupath = resolve(params.viu);
        if (existsSync(viupath)) {
            return viupath;
        } else {
            throw new Error('File not found: ' + resolve(params.viu));
        }
    } else {
        const path_l = resolve(__dirname, '..', '..', 'bin');
        if (!existsSync(path_l)) {
            mkdirSync(path_l, { recursive: true });
        }

        const files = readdirSync(path_l);
        if (files.length === 0) {
            let package_name = '';
            let offline_file = 'viu';
            if (process.platform === 'darwin' && process.arch === 'x64') {
                package_name = 'viu-x86_64-apple-darwin';
            } else if (process.platform === 'win32' && process.arch === 'x64') {
                package_name = 'viu-x86_64-pc-windows-msvc.exe';
                offline_file = 'viu.exe';
            } else if (process.platform === 'linux' && process.arch === 'x64') {
                package_name = 'viu-x86_64-unknown-linux-musl';
            } else if (process.platform === 'linux' && process.arch === 'arm64') {
                package_name = 'viu-arm64-unknown-linux-musl';
            } else if (process.platform === 'linux' && process.arch === 'arm' && process.config.variables.arm_version === 7) {
                package_name = 'viu-armv7-unknown-linux-musleabihf';
            } else if (process.platform === 'linux' && process.arch === 'arm' && process.config.variables.arm_version !== 7) {
                package_name = 'viu-arm-unknown-linux-musleabihf';
            } else {
                throw new Error('Platform not supported. Please download viu manually and place it in the bin folder.');
            }

            const url = `https://github.com/atanunq/viu/releases/download/v1.5.0/${package_name}`;
            const browser = new BROWSE();
            const { body } = await browser.request(url, { method: 'GET', autoredirect: true });
            if (!body) {
                throw new Error('No response body received');
            }
            const filePath = resolve(path_l, offline_file);
            writeFileSync(filePath, body);
            chmodSync(filePath, 0o755);
            return filePath;
        } else if (files.length === 1 && (files[0].endsWith('viu.exe') || files[0].endsWith('viu'))) {
            return resolve(path_l, files[0]);
        } else {
            throw new ReferenceError(`Multiple binary files or irrelevant files found in "${path_l}".`);
        }
    }
}
export { setviupath as viupath };
export default setviupath;