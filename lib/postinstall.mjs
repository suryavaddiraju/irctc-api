import * as fs from "node:fs";
const JSON_data = JSON.parse(fs.readFileSync("./package.json"));
const path = JSON_data.bin.viu;
fs.chmodSync(path, 0o755);