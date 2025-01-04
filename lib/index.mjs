import { writeFileSync} from 'node:fs';
import {dirname} from "node:path";
import { fileURLToPath } from 'node:url';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { execFileSync } from 'node:child_process';
import {headers as main_headers} from './headers.mjs';
import{BROWSE,StatusCodeError} from "./utils/browse.mjs";
import {viupath} from "./utils/viu.mjs"
import {book_validator} from './utils/form_validator.mjs';
import {stations} from "./utils/stations.mjs";
import {countries} from "./utils/countries.mjs";
import {vision_api} from "./utils/gcloud.mjs";
const __dirname = dirname(fileURLToPath(import.meta.url));

async function answer_captcha(params={},captcha){
    if(Object.prototype.hasOwnProperty.call(params, "gcloud")){
        return await vision_api(params,captcha);
    }else{
        writeFileSync(params.captcha_path,Buffer.from(captcha, 'base64'));
        const rl = readline.createInterface({ input, output });
        const answer = await rl.question(`${execFileSync(params.viu, [params.captcha_path,"-t"])} \nPlease type the above text and press enter\n`);
        rl.close();
        return answer;
    }
}

function normal_sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function psg_input_wait(psg_count){
    const psg_input_await = {
        1:20000,
        2:20000,
        3:25000,
        4:25000,
        5:30000,
        6:30000,
    }
    const sleep_time = psg_input_await[psg_count];
    console.log(`Sleeping for ${sleep_time * 0.001} seconds for passenger details input.`);
    await normal_sleep(sleep_time);
    return "Proceeding to Form Submission";
}

async function custom_sleep(params={}){
    const currentTime = new Date((new Date()).getTime()+params.difftm);
    const targetTime = new Date(currentTime);
    if(params.slot === 1 && params.callfrom === "class_availability"){
        targetTime.setUTCHours(4, 30, 0, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            console.log(`${balance_time} milliseconds left for availability check.\nSleeping for ${balance_time * 0.001} seconds to proceed for availability check.`);
            await normal_sleep(balance_time);
            return "Proceeding to Check Availability";
        }
        else{
            return "No Sleep Required";
        }
    }
    else if (params.slot === 2 && params.callfrom === "class_availability"){
        targetTime.setUTCHours(5, 30, 0, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            console.log(`${balance_time} milliseconds left for availability check.\nSleeping for ${balance_time * 0.001} seconds to proceed for availability check.`);
            await normal_sleep(balance_time);
            return "Proceeding to Check Availability";
        }
        else{
            return "No Sleep Required";
        }
    }
    else if(params.slot === 1 && params.callfrom === "login"){
        targetTime.setUTCHours(4, 28, 0, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            console.log(`${balance_time} milliseconds left for logging in.\nSleeping for ${balance_time * 0.001} seconds to proceed for Login.`);
            await normal_sleep(balance_time);
            return "Proceeding to Login";
        }
        else{
            return "No Sleep Required";
        }
    }
    else if(params.slot === 2 && params.callfrom === "login"){
        targetTime.setUTCHours(5, 28, 0, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            console.log(`${balance_time} milliseconds left for logging in.\nSleeping for ${balance_time * 0.001} seconds to proceed for Login.`);
            await normal_sleep(balance_time);
            return "Proceeding to Login";
        }
        else{
            return "No Sleep Required";
        }
    }
    else if(params.slot === 1 && params.callfrom === "starter"){
        targetTime.setUTCHours(4, 27, 0, 0);
        let stoptime = new Date(currentTime);
        stoptime.setUTCHours(18, 30, 0, 0);
        if (currentTime < targetTime || currentTime > stoptime) {
            throw new Error("Please Start the booking after 09:57:00.000 AM IST");
        }
        else{
            return "No Sleep Required";
        }
    }
    else if(params.slot === 2 && params.callfrom === "starter"){
        targetTime.setUTCHours(5, 27, 0, 0);
        let stoptime = new Date(currentTime);
        stoptime.setUTCHours(18, 30, 0, 0);
        if (currentTime < targetTime || currentTime > stoptime) {
            throw new Error("Please Start the booking after 10:57:00.000 AM IST");
        }
        else{
            return "No Sleep Required";
        }
    }
    else if(params.slot === 0){
        return "No Sleep Required";
    }
    else{
        throw new Error("Invalid slot value");
    }
}

async function load(params={}){
    params.viu = await viupath(params);
    await params.browse.request("https://www.irctc.co.in/nget/",{
        "method": "GET",
        "headers": main_headers.headers_1
    });
    const datetimedata = (new Date()).getTime();
    const url = "https://www.irctc.co.in/eticketing/protected/profile/textToNumber/"+(new Date()).getTime();
    const options = {
        "method": "GET",
        "headers": main_headers.headers_2
    };
    options.headers["greq"] = params.csrf;
    const startTm = (new Date()).getTime();
    const {body} = await params.browse.request(url,options);
    const endTm = (new Date()).getTime();
    const e = parseInt(body);
    params.diffTm = Math.round((endTm - startTm) / 2)+e;  // To get server time from now on use   (new Date()).getTime() + params.diffTm
    await custom_sleep({
        "slot":params.slot,
        "callfrom":"starter",
        "difftm":params.diffTm
    });
    return params;
}

async function login(params={}){
    const options = {
        method: "GET",
        headers: main_headers.headers_3
    };
    options.headers.greq = params.csrf;
    const {body} = await params.browse.request("https://www.irctc.co.in/eticketing/protected/mapps1/loginCaptcha?nlpCaptchaException=true",options);
    params.status = body.status;
    const answer = await answer_captcha(params,body.captchaQuestion);
    await custom_sleep({
        "slot":params.slot,
        "callfrom":"login",
        "difftm":params.diffTm
    });
    const {body:data} = await params.browse.request("https://www.irctc.co.in/authprovider/webtoken",{
        method: "POST",
        headers: main_headers.headers_4,
        body: {
            "grant_type": "password",
            "username": params.userID,
            "password": Buffer.from(params.password, 'utf8').toString('base64'),
            "captcha": answer,
            "uid": params.status,
            "otpLogin": "false",
            "nlpIdentifier": "",
            "nlpAnswer": "",
            "nlpToken": "",
            "lso": "",
            "encodedPwd": "true"
        }
    });
    if (Object.prototype.hasOwnProperty.call(data, "error")){
        if(data["error"] === "unauthorized" && data["error_description"] === "Invalid Captcha...."){
            return await login(params);
        }
        else if (data["error"] === "unauthorized" && data["error_description"] === "Bad credentials"){
            throw new TypeError("Invalid userID or password combination");
        }
        else{
            throw new Error(data.error_description);
        }
    }else{
        if(Object.prototype.hasOwnProperty.call(data, "access_token")){
            params.raw_token = data["access_token"];
            params.access_token = "Bearer " + params.raw_token;
            const headersa = main_headers.headers_5;
            headersa["greq"] = params.status;
            headersa["Authorization"] = params.access_token;
            headersa["spa-csrf-token"] = params.csrf;
            const {headers,body:userbody} = await params.browse.request("https://www.irctc.co.in/eticketing/protected/mapps1/validateUser?source=3",{
                "method": "GET",
                "headers": headersa
            });
            if (Object.prototype.hasOwnProperty.call(userbody, "emailVerified") && Object.prototype.hasOwnProperty.call(userbody, "mobileVerified")&& userbody.emailVerified && userbody.mobileVerified){
                params.isdCode = userbody.isdCode;
            }else{
                throw new TypeError("Email or Mobile not verified of IRCTC User profile, Kindly verify on irctc site and try again");
            }
            params.user_hash = userbody.userIdHash;
            params.csrf = headers["csrf-token"];
            return params;
        }
        else{
            throw new Error("Failed to login");
        }
    }
}

async function get_trains(book_params={},params={}){
    const headersa = main_headers.headers_6;
    headersa["greq"] = params.status;
    headersa["Authorization"]= params.access_token;
    headersa["spa-csrf-token"] = params.csrf;
    headersa["bmiyek"] = params.user_hash;
    const {headers,body:data} = await params.browse.request("https://www.irctc.co.in/eticketing/protected/mapps1/altAvlEnq/TC",{
        "method": "POST",
        "headers": headersa,
        "body": {
            "concessionBooking":false,
            "srcStn":book_params.from,
            "destStn":book_params.to,
            "jrnyClass":book_params.class,
            "jrnyDate":book_params.date,
            "quotaCode":book_params.quota,
            "currentBooking":"false",
            "flexiFlag":false,
            "handicapFlag":false,
            "ticketType":"E",
            "loyaltyRedemptionBooking":false,
            "ftBooking":false
        }
    });
    params.csrf = headers["csrf-token"];
    if ("errorMessage" in data) {
        throw new Error(data.errorMessage);
    }
    else{
        return params;
    };
}

async function class_availability(book_params={},params={}){
    const headersa = main_headers.headers_7;
    headersa["greq"] = params.status;
    headersa["Authorization"] = params.access_token;
    headersa['spa-csrf-token'] = params.csrf;
    headersa["bmiyek"] = params.user_hash;
    let response = null;
    const maxRetries = 5;
    let retries = 0;
    const cust_url = `https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/${book_params.train}/${book_params.date}/${book_params.from}/${book_params.to}/${book_params.class}/${book_params.quota}/N`;
    const options = {
        "method": "POST",
        "headers": headersa,
        "body": {
            "classCode":book_params.class,
            "concessionBooking":false,
            "fromStnCode":book_params.from,
            "ftBooking":false,
            "isLogedinReq":true,
            "journeyDate":book_params.date,
            "loyaltyRedemptionBooking":false,
            "moreThanOneDay":true,
            "paymentFlag":"N",
            "quotaCode": book_params.quota,
            "ticketType":"E",
            "toStnCode":book_params.to,
            "trainNumber":book_params.train,
        }
    };
    await custom_sleep({
        "slot":params.slot,
        "callfrom":"class_availability",
        "difftm":params.diffTm
    });
    while (retries < maxRetries) {
        if (retries >= maxRetries) {
            throw new Error("Maximum retries reached for getting class availability");
        }
        try {
            response = await params.browse.request(cust_url,options);
            break;
        } catch(error) {
            if (error instanceof StatusCodeError && error.statusCode === 502){
                console.log("Received Bad Gateway Response, Retrying again");
                retries++;
            }
            else{
                throw error;
            }
        }
    }
    params.csrf = response.headers["csrf-token"];
    if ("errorMessage" in response.body) {
        throw new Error(response.body.errorMessage);
    }
    else {
        return params;
    }
}

async function boarding_stations(book_params={},params={}){
    const headersa = main_headers.headers_8;
    headersa["greq"] = params.status;
    headersa["Authorization"] = params.access_token;
    headersa['spa-csrf-token'] = params.csrf;
    headersa["bmiyek"] = params.user_hash;
    let response = null;
    const maxRetries = 5;
    let retries = 0;
    const cust_url = "https://www.irctc.co.in/eticketing/protected/mapps1/boardingStationEnq";
    const options = {
        "method": "POST",
        "headers": headersa,
        "body": {
            "clusterFlag": "N",
            "onwardFlag": "N",
            "cod": "false",
            "reservationMode": "WS_TA_B2C",
            "autoUpgradationSelected": false,
            "gnToCkOpted": false,
            "paymentType": 1,
            "twoPhaseAuthRequired": false,
            "captureAddress": 0,
            "alternateAvlInputDTO": [
                {
                    "trainNo": book_params.train,
                    "destStn": book_params.to,
                    "srcStn": book_params.from,
                    "jrnyDate": book_params.date,
                    "quotaCode": book_params.quota,
                    "jrnyClass": book_params.class,
                    "concessionPassengers": false
                }
            ],
            "passBooking": false,
            "journalistBooking": false
        }
    };
    while (retries < maxRetries) {
        if (retries >= maxRetries) {
            throw new Error("Maximum retries reached for Boarding stations enquiry");
        }
        try{
            response = await params.browse.request(cust_url,options);
            break;
        }catch(error){
            if (error instanceof StatusCodeError && error.statusCode === 502){
                console.log("Received Bad Gateway Response, Retrying again");
                retries++;
            }
            else{
                throw error;
            }
        }
    };
    params.csrf = response.headers["csrf-token"];
    const data = response.body;
    if ("errorMessage" in data) {
        throw new Error(data.errorMessage);
    }else{
        return params;
    }
}

async function booking_form(book_params={},params={}){
    const headersa = main_headers.headers_9;
    headersa["greq"] = params.status;
    headersa["Authorization"] = params.access_token;
    headersa['spa-csrf-token'] = params.csrf;
    headersa["bmiyek"] = params.user_hash;
    let response = null;
    const maxRetries = 5;
    let retries = 0;
    const cust_url = "https://www.irctc.co.in/eticketing/protected/mapps1/allLapAvlFareEnq/Y";
    const options = {
        "method": "POST",
        "headers": headersa,
        "body": book_params.book_form_data
    };
    await psg_input_wait(book_params.book_form_data["lapAvlRequestDTO"][0]["passengerList"].length);
    while (retries < maxRetries) {
        if (retries >= maxRetries) {
            throw new Error("Maximum retries reached for Boarding stations enquiry");
        }
        try{
            response = await params.browse.request(cust_url,options);
            break;
        }catch(error){
            if (error instanceof StatusCodeError && error.statusCode === 502){
                console.log("Received Bad Gateway Response, Retrying again");
                retries++;
            }
            else{
                throw error;
            }
        }
    };
    params.csrf = response.headers["csrf-token"];
    const data = response.body;
    if ("errorMessage" in data) {
        throw new Error(data.errorMessage);
    }else if ("confirmation" in data) {
        throw new Error("Tickets are unavailable, Exiting Booking Process");
    }else if(Object.prototype.hasOwnProperty.call(data, "captchaDto") && Object.prototype.hasOwnProperty.call(data["captchaDto"], "nlpcaptchEnabled") && data["captchaDto"]["nlpcaptchEnabled"] == true){
        throw new Error("NLP Captcha is enabled, it is not supported yet")
    } else {
        book_params["captchaDto"] = {};
        book_params["captchaDto"]["captchaQuestion"] = data["captchaDto"]["captchaQuestion"];
        book_params.amnt = data["totalCollectibleAmount"];
        return params;
    }
}

async function confirm_booking_form(book_params={},params={}){
    book_params["captchaDto"]["captchastatus"] = "FAIL";
    const headersa = main_headers.headers_10;
    headersa["greq"] = params.status;
    headersa["Authorization"] = params.access_token;
    headersa["bmiyek"] = params.user_hash;
    while (book_params["captchaDto"]["captchastatus"] !== "SUCCESS"){
        let answer = await answer_captcha(params,book_params["captchaDto"]["captchaQuestion"]);
        headersa['spa-csrf-token'] = params.csrf;
        let response = await  params.browse.request(
            `https://www.irctc.co.in/eticketing/protected/mapps1/captchaverify/${book_params.tid}/BOOKINGWS/${answer}`,
            {
                "method":"GET",
                "headers": headersa,
            }
        );
        params.csrf = response.headers["csrf-token"];
        book_params["captchaDto"]["captchastatus"] = response.body.status;
        if (book_params["captchaDto"]["captchastatus"] === "FAIL"){
            book_params["captchaDto"]["captchaQuestion"] = response.body["captchaQuestion"];
        }else{
            break;
        }
    }
    return params;
}

async function payment_mode_selection(book_params={},params={}){
    let data = {};
    if(book_params.payment_type === "2"){
        data = {"bankId":"117","txnType":1,"paramList":[],"amount":book_params.amnt,"transationId":0,"txnStatus":1}
    }
    else if(book_params.payment_type === "3"){
        data = {"bankId":1000,"txnType":7,"paramList":[{"key":"TXN_PASSWORD","value":""}],"amount":book_params.amnt,"transationId":0,"txnStatus":1};
    }
    const headersa = main_headers.headers_11;
    headersa["greq"] = params.status;
    headersa["Authorization"] = params.access_token;
    headersa["bmiyek"] = params.user_hash;
    headersa['spa-csrf-token'] = params.csrf;
    const response = await params.browse.request(
        `https://www.irctc.co.in/eticketing/protected/mapps1/bookingInitPayment/${book_params.tid}?insurenceApplicable=`,
        {
            "method": "POST",
            "headers": headersa,
            "body": data
        }
    );
    params.csrf = response.headers["csrf-token"];
    if(Object.prototype.hasOwnProperty.call(response.body, "errorMsg")){
        throw new Error(response.body.errorMsg);
    }else{
        book_params.payment_webdata = response.body;
        if(book_params.payment_type === "2"){
            return await pay_with_upi(book_params,params);
        }
        else if(book_params.payment_type === "3"){
            return await pay_with_wallet(book_params,params);
        }
    }
}

async function pay_with_upi(book_params,params){
    if (Object.prototype.hasOwnProperty.call(book_params.payment_webdata, "errorMsg")){
        throw new Error(book_params.payment_webdata.errorMsg);
    }
    if (Object.prototype.hasOwnProperty.call(book_params.payment_webdata, "paramList")){
        const paramlist = book_params.payment_webdata["paramList"];
        let oid = "";
        for (let f of paramlist) {
            if (f["key"] === "TXN") {
                oid = f["value"];
                break;
            };
        };
        book_params.paytmgw = {};
        book_params.paytmgw.oid = oid;
        let response = await params.browse.request(
            "https://www.wps.irctc.co.in/eticketing/PaymentRedirect",
            {
                "method": "POST",
                "headers": main_headers.headers_12,
                "body": {
                    "token": params.raw_token,
                    "txn": `${params.userID}:${book_params.tid}`,
                    [`${params.userID}:${book_params.tid}`]: `${(new Date).getTime() / (1e5 * Math.random())}${params.csrf}${(new Date).getTime() / (1e6 * Math.random())}`
                }
            }
        );
        let request = await params.browse.request(
            response.body.split('<form action="')[1].split('" method="')[0],
            {
                "method": response.body.split('method="')[1].split('">')[0],
                "headers": main_headers.headers_13,
                "body": {
                    "MID": response.body.split('<input type="hidden" name="MID" value="')[1].split('">')[0],
                    "ENC_DATA":response.body.split('<input type="hidden" name="ENC_DATA" value="')[1].split('">')[0],
                    "CHECKSUMHASH":response.body.split('<input type="hidden" name="CHECKSUMHASH" value="')[1].split('">')[0],
                }
            }
        );
        book_params.paytmgw.landing = request.body;
        return await paytmgw_core(book_params,params);
    } else {
        throw new Error("Payment Paramets is not available in IRCTC Response, Exiting Booking Process");
    };
}
async function paytmgw_core(book_params={},params={}){
    const pushAppData = book_params.paytmgw.landing.split('var pushAppData="')[1].split('",encodeFlag="')[0];
    const encodeFlag = book_params.paytmgw.landing.split('var pushAppData="'+pushAppData+'",encodeFlag="')[1].split('";')[0];
    function base64DecodeUnicode(e) {
        for (var o = atob(e).split(""), a = 0; a < o.length; a++)
            o[a] = "%" + ("00" + o[a].charCodeAt(0).toString(16)).slice(-2);
        return decodeURIComponent(o.join(""))
    }
    let D = "true" == encodeFlag ? JSON.parse(base64DecodeUnicode(pushAppData)) : JSON.parse(pushAppData);
    book_params.paytmgw.txntkn = D["txnToken"];
    book_params.paytmgw.MID = D["merchant"]["mid"];
    book_params.paytmgw.tmp = new Date().getTime();
    let response = await params.browse.request(
        `https://secure.paytmpayments.com/theia/api/v1/processTransaction?mid=${book_params.paytmgw.MID}&orderId=${book_params.paytmgw.oid}`,
        {
            "method": "POST",
            "headers": main_headers.headers_14,
            "body": {
                'head': {
                    'version': 'v1',
                    'requestTimestamp': book_params.paytmgw.tmp,
                    'channelId': 'WEB',
                    'txnToken': book_params.paytmgw.txntkn,
                    'workFlow': 'enhancedCashierFlow',
                    'token': book_params.paytmgw.txntkn,
                    'tokenType': 'TXN_TOKEN'
                },
                'body': {
                    'paymentMode': 'UPI',
                    'payerAccount': book_params.payment,
                    'requestType': 'NATIVE',
                    'authMode': '3D',
                    'mid': book_params.paytmgw.MID,
                    'orderId': book_params.paytmgw.oid,
                    'paymentFlow': 'NONE',
                    'selectedPaymentModeId': "2",
                    'riskExtendInfo': `userAgent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0|timeZone:Asia/Calcutta|operationType:PAYMENT|refererURL:https://securegw.paytm.in/|businessFlow:STANDARD|amount:${book_params.amnt}|merchantType:offus|language:en-US|screenResolution:1536X864|networkType:4g|osType:Windows|osVersion:10|platform:WEB|channelId:WEB|deviceType:Desktop|browserType:Edge|browserVersion:130.0.0.0|`
                },
                'showPostFetchLoader': false
            }
        }
    );
    if (response["body"]["body"]["resultInfo"]["resultStatus"] == "F"){
        throw new Error(response["body"]["body"]["resultInfo"]["resultMsg"])
    }
    else{
        console.log(`Please approve the UPI Collect request from the UPI ID ${response["body"]["body"]["content"]["MERCHANT_VPA"]} for INR ${response["body"]["body"]["content"]["TXN_AMOUNT"]} with payment remarks as \'Oid${response["body"]["body"]["content"]["ORDER_ID"]}@IRCTCWebUPI\' in your ${response["body"]["body"]["content"]["upiHandleInfo"]["upiAppName"]} app`);
        book_params.paytmgw.callback = {};
        book_params.paytmgw.callback.body = response["body"]["body"]["content"];
        book_params.paytmgw.callback.url = response["body"]["body"]["callbackUrl"];
    }
    let result = true;
    const STATUS_TIMEOUT = parseInt(book_params.paytmgw.callback.body["STATUS_TIMEOUT"]);
    const STATUS_INTERVAL = parseInt(book_params.paytmgw.callback.body["STATUS_INTERVAL"]);
    const startTime = Date.now();
    while(result){
        response = await params.browse.request(
            book_params.paytmgw.callback.body.upiStatusUrl,
            {
                "method":"POST",
                "headers": main_headers.headers_15,
                "body": {
                    "merchantId": book_params.paytmgw.MID,
                    "orderId": book_params.paytmgw.oid,
                    "transId": book_params.paytmgw.callback.body.transId,
                    "paymentMode": 'UPI',
                    "cashierRequestId": book_params.paytmgw.callback.body.cashierRequestId
                }
            }
        );
        if(response.body["POLL_STATUS"] === "POLL_AGAIN"){
            result = true;
        }else{
            result = false;
        }
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= STATUS_TIMEOUT) {
            result = false;
        }
        if (result) {
            await new Promise(resolve => setTimeout(resolve, parseInt(book_params.paytmgw.callback.body["STATUS_INTERVAL"])));
        }
    }
    const headersa = main_headers.headers_16
    headersa["Referer"] = book_params.paytmgw.callback.url
    response = await params.browse.request(
        book_params.paytmgw.callback.url,
        {
            "method": "POST",
            "headers": headersa,
            "body": book_params.paytmgw.callback.body,
        }
    );
    if(response.body.includes('pushAppData="')){
        book_params.paytmgw.landing = response.body;
        return await paytmgw_core(book_params,params);
    }else{
        response = await params.browse.request(
            response.body.split("<FORM NAME='TESTFORM' ACTION='")[1].split("' METHOD='")[0],
            {
                "method": response.body.split("' METHOD='")[1].split("'>")[0],
                "headers": main_headers.headers_17,
                "body": {
                    "MID": response.body.split("<input type='hidden' name='MID' value='")[1].split("'>")[0],
                    "ENC_DATA":response.body.split("<input type='hidden' name='ENC_DATA' value='")[1].split("'>")[0],
                    "CHECKSUMHASH":response.body.split("<input type='hidden' name='CHECKSUMHASH' value='")[1].split("'>")[0],
                }
            }
        );
        if (response.statusCode === 302 && Object.prototype.hasOwnProperty.call(response.headers,"location")){
            response = await params.browse.request(
                response.headers.location,
                {
                    "method": "GET",
                    "headers": main_headers.headers_18
                }
            );
            const headersb = main_headers.headers_19;
            headersb["bmiyek"] = params.user_hash;
            headersb["greq"] = params.status;
            headersb["spa-csrf-token"] = params.csrf;
            headersb["Authorization"] = params.access_token;
            response = await params.browse.request(
                `https://www.wps.irctc.co.in/eticketing/protected/mapps1/bookingData/${book_params.tid}`,
                {
                    "method": "GET",
                    "headers": headersb
                }
            );
            if(Object.prototype.hasOwnProperty.call(response.headers, "csrf-token")){
                params.csrf = response.headers["csrf-token"];
            }
            return response;
        }else{
            throw new Error("Payment Gateway Redirect Failed");
        }
    }
}

async function pay_with_wallet(book_params={},params={}){
    const requestt = await params.browse.request(
        `https://www.wps.irctc.co.in/eticketing/protected/mapps1/verifyPayment/${book_params.tid}`,
        {
            "method": "OPTIONS",
            "headers": main_headers.headers_25
        }
    );
    let otp = 0;
    const paramslist = [{"key":"OTP"},{"key":"TXN_TYPE","value":"undefined"}];
    if(book_params.payment_webdata["withoutOTP"] === "false"){
        const rl = readline.createInterface({ input, output });
        otp = await rl.question("Please enter the IRCTC wallet OTP and press enter\n");
        rl.close();
        for (let i=0;i<paramslist.length;i++){
            if(paramslist[i].key === "OTP"){
                paramslist[i].value = parseInt(otp);
            }
        }
    }
    book_params.payment_webdata.paramList = paramslist;
    const headersa = main_headers.headers_26;
    headersa["greq"] = params.status;
    headersa["Authorization"] = params.access_token;
    headersa["bmiyek"] = params.user_hash;
    headersa['spa-csrf-token'] = params.csrf;
    const response = await params.browse.request(
        `https://www.wps.irctc.co.in/eticketing/protected/mapps1/verifyPayment/${book_params.tid}`,
        {
            "method": "POST",
            "headers": headersa,
            "body": book_params.payment_webdata
        }
    );
    if(Object.prototype.hasOwnProperty.call(response.headers, "csrf-token")){
        params.csrf = response.headers["csrf-token"];
    }
    return response;
}

class IRCTC{
    constructor(params={}){
        this.slot = 0;
        this.starter_load_complete = false;
        this.browse = new BROWSE();
        this.csrf = ""+(new Date()).getTime();
        this.captcha_path = "./captcha.png";
        Object.assign(this, params);
        const useridregex = /^[a-zA-Z0-9]{3,35}$/;
        if (!(this.userID && typeof this.userID === "string" && useridregex.test(this.userID))) {
            throw new TypeError('Invalid "userID" parameter');
        }
        const pwdregex = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Zd@$!%*#^?&]).{8,15})");
        if (!(this.password && typeof this.password === "string" && pwdregex.test(this.password))) {
            throw new TypeError('Invalid "password" parameter');
        }
    }

    async master_passengers(){
        await this.starter();
        const params = this;
        const headersa = main_headers.headers_24;
        headersa["greq"] = params.status;
        headersa["Authorization"] = params.access_token;
        headersa["bmiyek"] = params.user_hash;
        let response = {"body":{"errorMessage":"Unable to fetch Master Passenger List"}};
        const maxRetries = 5;
        let retries = 0;
        const cust_url = "https://www.irctc.co.in/eticketing/protected/mapps1/masterpsgnlistenquiry";
        const options = {
            "method": "GET",
            "headers": headersa
        };
        while (retries < maxRetries) {
            if (retries >= maxRetries) {
                throw new Error("Maximum retries reached for Boarding stations enquiry");
            }
            try{
                response = await params.browse.request(cust_url,options);
                break;
            }catch(error){
                if (error instanceof StatusCodeError && error.statusCode === 502){
                    console.log("Received Bad Gateway Response, Retrying again");
                    retries++;
                }
                else{
                    throw error;
                }
            }
        };
        if (response.body.errorMessage) {
            throw new Error(response.body.errorMessage);
        }
        const data = response.body;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        }
        else {
            return data;
        }
    }

    async starter(force=false){
        if(this.starter_load_complete){
            if(force){
                await load(this);
                await login(this);
                this.starter_load_complete = true;
                return;
            }else{
                return;
            }
        }else{
            await load(this);
            await login(this);
            this.starter_load_complete = true;
            return;
        }
    }

    async book(params={}){
        if (["TQ", "PT"].includes(params.quota) && ["2A","3A","EC","CC","3E"].includes(params.class)){
            this.slot = 1;
        }
        else if (["TQ", "PT"].includes(params.quota) && ["FC","SL","2S"].includes(params.class)){
            this.slot = 2;
        }
        params.tid = (new Date).getTime().toString(36);
        params.book_form_data = await book_validator(params,this);
        await this.starter();
        await get_trains(params,this);
        await class_availability(params,this);
        await boarding_stations(params,this);
        await booking_form(params,this);
        await confirm_booking_form(params,this);
        const response = await payment_mode_selection(params,this);
        console.log(response.body);
        return response;
    }

    async last_transaction(){
        await this.starter();
        const params = this;
        const headersa = main_headers.headers_20;
        headersa["greq"] = params.status;
        headersa["Authorization"]= params.access_token;
        headersa["bmiyek"] = params.user_hash;
        let response = await params.browse.request(
            "https://www.irctc.co.in/eticketing/protected/mapps1/recentTxnsDetails",
            {
                "method": "GET",
                "headers": headersa
            }
        );
        if (response.body.errorMessage) {
            throw new Error(response.body.errorMessage);
        }
        const headersb = main_headers.headers_22;
        headersb["greq"] = params.status;
        headersb["Authorization"]= params.access_token;
        headersb["spa-csrf-token"] = params.csrf;
        headersb["bmiyek"] = params.user_hash;
        headersb["Referer"] = `https://www.irctc.co.in/nget/enquiry/last-book-ticket?txnId=${response.body.lastTxnList[0].transactionId}`;
        response = await params.browse.request(
            `https://www.irctc.co.in/eticketing/protected/mapps1/historySearchByTxnId/${response.body.lastTxnList[0].transactionId}?currentStatus=L`,
            {
                "method": "GET",
                "headers": headersb
            }
        );
        params.csrf = response.headers["csrf-token"];
        return response.body;
    }

    async pnr_status(pnr=""){
        const params = this;
        await this.starter();
        const headersb = main_headers.headers_21;
        headersb["greq"] = params.status;
        headersb["Authorization"]= params.access_token;
        headersb["spa-csrf-token"] = params.csrf;
        headersb["bmiyek"] = params.user_hash;
        const response = await params.browse.request(
            `https://www.irctc.co.in/eticketing/protected/mapps1/pnrenq/${pnr}?pnrEnqType=E`,
            {
                headers: headersb,
            }
        );
        if (response.body.errorMessage) {
            throw new Error(response.body.errorMessage);
        }
        params.csrf = response.headers["csrf-token"];
        return response.body;
    }
}

export {IRCTC,countries,stations};
export default IRCTC;