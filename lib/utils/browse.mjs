import {request as undicireq} from "undici";
import {Cookie,CookieJar} from "tough-cookie";
import {createBrotliDecompress,createInflate,createGunzip} from "node:zlib";

class StatusCodeError extends Error {
    constructor(message, statusCode) {
        super(message);
        this["name"] = this.constructor.name;
        this["statusCode"] = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BROWSE {
    constructor(options={}){
        this.cookiejar = new CookieJar();
        this.maxRedirections = options.maxRedirections || 5;
        this.redirectcount = 0;
    }

    async getcookies(url,headers) {
        const cookies = await this.cookiejar.getCookies(url);
        if (cookies && cookies.length) {
            headers["Cookie"] = cookies.map(cookie => cookie.cookieString()).join(';');
        }
    }

    async setcookies(url, headers) {
        if (headers && Object.prototype.hasOwnProperty.call(headers,"set-cookie")) {
            const cookies = Array.isArray(headers["set-cookie"]) ? headers["set-cookie"].map(Cookie.parse) : [Cookie.parse(headers["set-cookie"])];
            for (let cookie of cookies){
                this.cookiejar.setCookie(cookie, url);
            };
        };
    }

    async converttobuffer(body){
        let data = [];
        for await (const chunk of body){
            data.push(chunk);
        }
        return Buffer.concat(data);
    }

    async handlebody(headers,body){
        if (headers && Object.prototype.hasOwnProperty.call(headers, "content-encoding") && ['gzip', 'deflate', 'br'].includes(headers['content-encoding'])){
            if (headers["content-encoding"] === "br") {
                return body.pipe(createBrotliDecompress());
            } else if (headers["content-encoding"] === "gzip") {
                return body.pipe(createGunzip());
            } else if (headers["content-encoding"] === "deflate") {
                return body.pipe(createInflate());
            }
        }
        return body;
    }

    async request(url,options={}){
        if (!Object.prototype.hasOwnProperty.call(options, "headers")) {
            options.headers = {};
        }
        options.headers["Host"] = new URL(url).hostname;
        await this.getcookies(url,options.headers);
        if (Object.prototype.hasOwnProperty.call(options.headers,"Content-Type") && Object.prototype.hasOwnProperty.call(options,"body") && typeof options.body === "object"){
            if (options.headers["Content-Type"].startsWith("application/json")){
                options.body = JSON.stringify(options.body);
            }
            else if (options.headers["Content-Type"].startsWith("application/x-www-form-urlencoded")){
                options.body = new URLSearchParams(options.body).toString();
            }
        }
        if (Object.prototype.hasOwnProperty.call(options,"body")){
            options.headers["Content-Length"] = Buffer.byteLength(options.body);
        }
        const {statusCode, headers, body} = await undicireq(url, options);
        await this.setcookies(url,headers);
        if (headers && headers.location && this.redirectcount <= this.maxRedirections){
            const autoredirect = options.autoredirect || false;
            if(autoredirect){
                this.redirectcount++;
                const newUrl = headers.location;
                const newHeaders = { ...options.headers };
                if (new URL(url).hostname !== new URL(newUrl).hostname){
                    newHeaders["Referer"] = new URL(url).hostname;
                }else{
                    newHeaders["Referer"] = url.split("?")[0];
                }
                delete newHeaders["Cookie"];
                return this.request(newUrl, { ...options, headers: newHeaders });
            }
        }
        this.redirectcount = 0;
        const processedBody = await this.handlebody(headers, body);
        let data = await this.converttobuffer(processedBody);
        if (headers && Object.prototype.hasOwnProperty.call(headers, "content-type") && data && data.length > 0){
            if(headers["content-type"].startsWith("application/json")){
                data = JSON.parse(data.toString());
            }
            else if(headers["content-type"].startsWith("text")){
                data = data.toString();
            }
        }
        if (statusCode >= 400){
            throw new StatusCodeError(`Request failed with status code ${statusCode}`, statusCode);
        }
        return {"statusCode":statusCode,"headers":headers,"body":data};
    }
}
export {BROWSE,StatusCodeError};
export default BROWSE;