import {appendFileSync} from 'fs';
const url = "https://www.irctc.co.in/eticketing/protected/mapps1/pnrenq/123456789?pnrEnqType=E";
const method = "GET";
const count = 22;
const headersString = `

`;
const headers_1 = {};
headersString.trim().split('\n').forEach(line => {
    const parts = line.split(': ');
    const key = parts[0];
    const value = parts[1];
    headers_1[key] = value;
});
appendFileSync('browser_headers.mjs', `// --${method} --${url}\nconst headers_${count} = ${JSON.stringify(headers_1, null, 4)};\n`);