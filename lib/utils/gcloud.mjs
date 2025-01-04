import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { request } from "node:https";
import { URLSearchParams } from "node:url";

async function checker(service_account,params){
	function isPlainObject(value) {
		return (
		  typeof value === 'object' && 
		  value !== null && 
		  !Buffer.isBuffer(value) &&
		  !Array.isArray(value) && 
		  value.constructor === Object
		);
	}

	function isgcloudservice(value){
		return (
			isPlainObject(value) && 
			Object.prototype.hasOwnProperty.call(value,"type") && 
			typeof value.type === "string" && 
			value.type === "service_account" && 
			Object.prototype.hasOwnProperty.call(value,"private_key_id") && 
			Object.prototype.hasOwnProperty.call(value,"private_key") && 
			typeof value.private_key === "string" && 
			value.private_key.startsWith("-----BEGIN PRIVATE KEY-----") && 
			(
				value.private_key.endsWith("-----END PRIVATE KEY-----") || 
				value.private_key.endsWith("-----END PRIVATE KEY-----\n")
			) && 
			Object.prototype.hasOwnProperty.call(value,"client_email") && 
			typeof value.client_email === "string" && 
			value.client_email.endsWith(".iam.gserviceaccount.com") &&
			!Object.prototype.hasOwnProperty.call(value,"token")
		);
	}

	if (typeof service_account === "string"){
		service_account = service_account.trim();
		if (service_account.startsWith('{') && service_account.endsWith('}')){
			service_account = JSON.parse(service_account);
			return await checker(service_account,params);
		}else{
			throw new Error(`Invalid Parameter: value for gcloud key must be an object or valid JSON file content provided by google`);
		}
	} else if (typeof service_account === "object" && Buffer.isBuffer(service_account)){
		return await checker(service_account.toString(),params);
	} else if (isgcloudservice(service_account)){
		params.gcloud_project = service_account.project_id;
		return await generate_token(service_account);
	} else if (isPlainObject(service_account) && Object.prototype.hasOwnProperty.call(service_account,"token") && Object.prototype.hasOwnProperty.call(service_account,"project_id")){
		params.gcloud_project = service_account.project_id;
		return service_account.token;
	}else{
		throw new Error(`Invalid Parameter: value for gcloud key must be an object or valid JSON file content provided by google`);
	}
}

async function generate_token(service_account) {
	try {
		const header = Buffer.from(
		JSON.stringify({
			alg: "RS256",
			typ: "JWT",
			kid: service_account.private_key_id,
		})
		).toString("base64url");
		const iat = Math.floor(Date.now() / 1000);
		const payload = Buffer.from(
		JSON.stringify({
			iss: service_account.client_email,
			scope: "https://www.googleapis.com/auth/cloud-vision",
			aud: "https://oauth2.googleapis.com/token",
			exp: iat + 3600,
			iat: iat,
		})
		).toString("base64url");
		const signature = createSign("RSA-SHA256").update(`${header}.${payload}`).sign(service_account.private_key, "base64url");
		const post_body = new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: `${header}.${payload}.${signature}`
		});
		return new Promise((resolve, reject) => {
			const req = request(
				"https://oauth2.googleapis.com/token",
				{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				},
				(res) => {
				const chunks = [];
				res.on("data", (chunk) => {
					chunks.push(chunk);
				});

				res.on("end", () => {
					const data = JSON.parse(Buffer.concat(chunks).toString());
					if (Object.prototype.hasOwnProperty.call(data,"access_token") && typeof data.access_token === "string" && data.access_token.length > 10){
					resolve(data.access_token);
					}
					else{
						reject(data);
					}
				});
				}
			);
			req.on("error", (e) => {
				reject(e);
			});
			req.write(post_body.toString());
			req.end();
		});
	} catch (e) {
		throw new Error(`Error generating token: ${e.message}`);
	}
}

async function vision_api(params={},captcha){
	try{
		if (!Object.prototype.hasOwnProperty.call(params,"gcloud_token")){
			params.gcloud_token = await checker(params.gcloud,params);
			return await vision_api(params,captcha);
		}else{
			return new Promise((resolve, reject) => {
				const req = request("https://vision.googleapis.com/v1/images:annotate",{
					"method":"POST",
					"headers":
					{
						"Authorization":`Bearer ${params.gcloud_token}`,
						"x-goog-user-project":params.gcloud_project,
						"Content-Type":"application/json; charset=utf-8"
					}
				},(res) =>{
					const chunks = [];
					res.on("data", (chunk) => {
						chunks.push(chunk);
					});
					res.on("end", () => {
						const data = Buffer.concat(chunks).toString();
						if (res.statusCode !== 200){
							reject(data);
						}else{
							resolve((JSON.parse(data)).responses[0].fullTextAnnotation.text.replace(/[\s\n\r]/g,''));
						}
					});
				});
				req.on("error", (e) => {
					console.error("Request error:", e); 
					reject(e);
				});
				req.write(JSON.stringify({
					"requests": [
							{
								"image": {
									"content": captcha
								},
								"features": [
									{
										"type": "TEXT_DETECTION"
									}
								]
							}
						]
					}
				));
				req.end();
			});
		}
	} catch(e){
		throw new Error(`Error at Google Cloud Vision API:\n${e}`);
	}
}

export default vision_api;
export {vision_api};