import axios from 'axios';
import {wrapper} from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { writeFileSync } from 'fs';
import * as cheerio from 'cheerio';
import querystring from 'querystring';
import { exec } from 'child_process';
import { URL } from 'url';
import {verify_booking_params, initialize_booking_variables, input, base64DecodeUnicode} from './utils.mjs';
import { psg_input_wait, sleep_for_login, sleep_for_availability_check} from "./time_work.mjs";
import {headers as main_headers} from './browser_headers.mjs';
class IRCTC{
    constructor(){
        wrapper(axios);
        const cookie_jar = new CookieJar();
        this.axios_instance = axios.create({ 
            jar:cookie_jar,
            withCredentials: true,
        });
    }
    async load_irctc(){
        let response = await this.axios_instance.get(
            'https://www.irctc.co.in/nget/',
            {
                headers: main_headers.headers_1,
            }
        );
        this.first_csrf = "" + (new Date).getTime();
        const headers = main_headers.headers_2;
        headers.greq = this.first_csrf;
        response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/profile/textToNumber/'+(new Date).getTime(),
            {
                headers: headers,
            }
        );
        return "IRCTC Loaded Successfully";
    }
    async sign_in(){
        await this.clicking_sign_button();
        await this.getting_token();
        return "Sign In Successfull";
    }
    async clicking_sign_button(){
        let headers = main_headers.headers_3;
        headers.greq = this.first_csrf;
        const response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/mapps1/loginCaptcha?nlpCaptchaException=true',
            {
                headers: headers,
            }
        );
        const captcha_response=response.data;
        this.captchaQuestion=captcha_response.captchaQuestion;
        this.captcha_status=captcha_response.status;
        await this.answer_captcha();
        return "Sign Button Clicked Successfully";
    }
    async answer_captcha(){
        let imagePath = './captcha.jpg';
        writeFileSync(imagePath, this.captchaQuestion, 'base64');
        exec('viu captcha.jpg -t', (error, stdout, stderr) => {
            console.log(`${stdout}\nEnter the Captcha Answer below in this terminal`);
            console.log(stderr);
            if (error !== null) {
              console.log(`exec error: ${error}`);
            }
        });
        this.captcha_answer = await input('');
        await this.send_login();
        return "Captcha Answered Successfully";
    }
    async send_login(){
        const data = `grant_type=password&username=${this.username}&password=${this.password}&captcha=${this.captcha_answer}&uid=${this.captcha_status}&otpLogin=false&nlpIdentifier=&nlpAnswer=&nlpToken=&lso=&encodedPwd=true`;
        const headers = main_headers.headers_4;
        headers["Content-Length"] = data.length.toString();
        await sleep_for_login(this.params.ticket_time);
        const response = await this.axios_instance.post(
            'https://www.irctc.co.in/authprovider/webtoken',
            data,
            {
                headers: headers,
            }
        );
        this.act = response.data;
        return "Login Data Sent Successfully";
    }
    async getting_token(){
        while ("error" in this.act) {
            if (this.act["error"] === "unauthorized" && this.act["error_description"] === "Invalid Captcha....") {
                await this.clicking_sign_button();
            } else if (this.act["error"] === "unauthorized" && this.act["error_description"] === "Bad credentials") {
                throw new Error("Invalid user and password combination");
            } else {
                throw new Error("Some Unknown error occurred in getting token process");
            }
        };
        if ("access_token" in this.act) {
            this.access_token = "Bearer " + this.act["access_token"];
        } else {
            throw new Error("Some Unknown error occurred in getting token process");
        };
        await this.validate_user();
        return "Token Generated Successfully";
    }
    async validate_user(){
        const headers = main_headers.headers_5;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.first_csrf;
        const response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/mapps1/validateUser?source=3',
            {
                headers: headers,
            }
        );
        this.user_data = response.data;
        this.user_hash = response.data["userIdHash"];
        this.csrf_token = response.headers["csrf-token"];
        return "User Validated Successfully";
    }
    async get_trains(){
        const postdata = {"concessionBooking":false,"srcStn":this.from_stn,"destStn":this.to_stn,"jrnyClass":this.class_type,"jrnyDate":this.journey_date,"quotaCode":this.quota_type,"currentBooking":"false","flexiFlag":false,"handicapFlag":false,"ticketType":"E","loyaltyRedemptionBooking":false,"ftBooking":false};
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_6;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        const response = await this.axios_instance.post(
            "https://www.irctc.co.in/eticketing/protected/mapps1/altAvlEnq/TC",
            postdata_string,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        }
        else{
            return "Train List Fetched Successfully";
        };
    }
    async get_class_availability(){
        const postdata = {
            "paymentFlag": "N",
            "concessionBooking": false,
            "ftBooking": false,
            "loyaltyRedemptionBooking": false,
            "ticketType": "E",
            "quotaCode": this.quota_type,
            "moreThanOneDay": true,
            "trainNumber": this.train_number,
            "fromStnCode": this.from_stn,
            "toStnCode": this.to_stn,
            "isLogedinReq": true,
            "journeyDate": this.journey_date,
            "classCode": this.class_type
        };
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_7;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        await sleep_for_availability_check(this.params.ticket_time);
        const response = await this.axios_instance.post(
            `https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/${this.train_number}/${this.journey_date}/${this.from_stn}/${this.to_stn}/${this.class_type}/${this.quota_type}/N`,
            postdata_string,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        }
        else {
            await this.get_boarding_stations();
            return "Class Availability Fetched Successfully";
        }
    }
    async get_boarding_stations(){
        const postdata = {
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
                    "trainNo": this.train_number,
                    "destStn": this.to_stn,
                    "srcStn": this.from_stn,
                    "jrnyDate": this.journey_date,
                    "quotaCode": this.quota_type,
                    "jrnyClass": this.class_type,
                    "concessionPassengers": false
                }
            ],
            "passBooking": false,
            "journalistBooking": false
        };
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_8;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        const response = await this.axios_instance.post(
            "https://www.irctc.co.in/eticketing/protected/mapps1/boardingStationEnq",
            postdata_string,
            {
                headers: headers,
            }
        )
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        } else {
            if (data["bkgCfgs"][0]["foodChoiceEnabled"] === true){
                if (this.foodList.includes('')){
                    throw new Error("Food choice is enabled, please provide food choice for all passengers");
                }
                else{
                    let list_B = data["bkgCfgs"][0]["foodDetails"];
                    for (const item of this.foodList) {
                        if (!list_B.includes(item)) {
                            throw new Error("Food choice is enabled, please provide food choice for all passengers");
                        };
                    };
                };
            };
            return "Boarding Stations Fetched Successfully";
        };
    }
    async fill_booking_details(){
        this.tid = (new Date).getTime().toString(36);
        const postdata = {
            "clusterFlag": "N",
            "onwardFlag": "N",
            "cod": "false",
            "reservationMode": "WS_TA_B2C",
            "autoUpgradationSelected": true,
            "gnToCkOpted": false,
            "paymentType": "2",
            "twoPhaseAuthRequired": false,
            "captureAddress": 0,
            "wsUserLogin": this.username,
            "moreThanOneDay": false,
            "clientTransactionId": this.tid,
            "boardingStation": this.from_stn,
            "reservationUptoStation": this.to_stn,
            "mobileNumber": this.mobile_number,
            "ticketType": "E",
            "mainJourneyTxnId": null,
            "mainJourneyPnr": "",
            "captcha": "",
            "generalistChildConfirm": false,
            "ftBooking": false,
            "loyaltyRedemptionBooking": false,
            "nosbBooking": false,
            "warrentType": 0,
            "ftTnCAgree": false,
            "bookingChoice": 1,
            "bookingConfirmChoice": 1,
            "bookOnlyIfCnf": true,
            "returnJourney": null,
            "connectingJourney": false,
            "lapAvlRequestDTO": [{
                "trainNo": this.train_number,
                "journeyDate": this.journey_date,
                "fromStation": this.from_stn,
                "toStation": this.to_stn,
                "journeyClass": this.class_type,
                "quota": this.quota_type,
                "coachId": null,
                "reservationChoice": 4,
                "ignoreChoiceIfWl": false,
                "travelInsuranceOpted": "true",
                "warrentType": 0,
                "coachPreferred": false,
                "autoUpgradation": false,
                "bookOnlyIfCnf": true,
                "addMealInput": null,
                "concessionBooking": false,
                "passengerList": this.passengers,
                "ssQuotaSplitCoach": "N"
            }],
            "gstDetails": {
              "gstIn": "",
              "error": null
            }
        };
        if (this.params.coach){
            postdata.lapAvlRequestDTO[0].coachId = this.params.coach;
        }
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_9;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        await psg_input_wait(this.psg_count);
        const response = await this.axios_instance.post(
            "https://www.irctc.co.in/eticketing/protected/mapps1/allLapAvlFareEnq/Y",
            postdata_string,
            {
                headers: headers,
            }
        )
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        } else if ("confirmation" in data) {
            throw new Error("Tickets are unavailable, Exiting Booking Process");
        } else {
            this.amnt = data["totalCollectibleAmount"];
            if (data["captchaDto"]["nlpcaptchEnabled"] == true){
                throw new Error("NLP Captcha is enabled, it is not supported yet")
            }
            else{
                this.captchaQuestion = data["captchaDto"]["captchaQuestion"]
                return "Booking Details Filled Successfully";
            };
        };
    }
    async confirm_booking(){
        this.booking_captcha_response = "FAIL";
        const headers = main_headers.headers_10;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        while (this.booking_captcha_response !== "SUCCESS"){
            await this.answer_captcha();
            headers['spa-csrf-token'] = this.csrf_token;
            let response = await this.axios_instance.get(
                `https://www.irctc.co.in/eticketing/protected/mapps1/captchaverify/${this.tid}/BOOKINGWS/${this.captcha_answer}`,
                {
                    headers: headers,
                }
            );
            this.csrf_token = response.headers["csrf-token"];
            let data = response.data;
            this.booking_captcha_response = data.status;
            if (this.booking_captcha_response === "FAIL"){
                this.captchaQuestion = response.data["captchaQuestion"];
            };
        };
        return "Booking Details were self confirmed using captcha Successfully";
    }
    async select_paytm_upi_gateway(){
        const data = {"bankId":"117","txnType":1,"paramList":[],"amount":this.amnt,"transationId":0,"txnStatus":1};
        const data_string = JSON.stringify(data);
        const headers = main_headers.headers_11;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = data_string.length.toString();
        const response = await this.axios_instance.post(
            `https://www.irctc.co.in/eticketing/protected/mapps1/bookingInitPayment/${this.tid}?insurenceApplicable=`,
            data_string,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        if (!"paramList" in response.data){
            throw new Error("Payment is not available, Exiting Booking Process");
        } else {
            const paramlist = response.data["paramList"];
            let oid = "";
            for (let f of paramlist) {
                if (f["key"] === "TXN") {
                    oid = f["value"];
                    break;
                };
            };
            this.oid = oid;
            await this.get_gateway_redirect_params();
            return "Paytm UPI Payment Gateway Selected Successfully";
        };
    }
    async get_gateway_redirect_params(){
        const xx = `${(new Date).getTime() / (1e5 * Math.random())}${this.csrf_token}${(new Date).getTime() / (1e6 * Math.random())}`;
        const raw_token = this.access_token.split("Bearer ")[1];
        const b = `token=${raw_token}&txn=${this.username}%3A${this.tid}&${this.username}%3A${this.tid}=${xx}`;
        const headers = main_headers.headers_12;
        headers["Content-Length"] = b.length.toString();
        const response = await this.axios_instance.post(
            "https://www.wps.irctc.co.in/eticketing/PaymentRedirect",
            b,
            {
                headers: headers,
            }
        );
        this.paytm_html = response.data;
        await this.going_to_paytm();
        return "Paytm UPI Gateway Redirect Parameters Fetched Successfully";
    }
    async going_to_paytm(){
        const $ = cheerio.load(this.paytm_html);
        const form = $('form');
        const action_url = form.attr('action')
        const input_elements = form.find('input');
        let body_data = {};
        input_elements.each((index, element) => {
            const raw_variable = $(element).attr('value');
            body_data[$(element).attr('name')] = raw_variable;
        });
        const headers = main_headers.headers_13;
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        const response = await this.axios_instance.post(
            action_url,
            body_data,
            {
                headers: headers,
                withCredentials: false
            }
        );
        this.paytm_params_d = response.data;
        await this.paytm_pg_landing_page();
        return "Gone to Paytm UPI Gateway Successfully";
    }
    async paytm_pg_landing_page(){
        let script_data = this.paytm_params_d;
        const pushAppData = script_data.split('pushAppData="')[1].split('",encodeFlag=')[0];
        const encodeFlag = script_data.split(',encodeFlag="')[1].split('";')[0];
        let D = "true" == encodeFlag ? JSON.parse(base64DecodeUnicode(pushAppData)) : JSON.parse(pushAppData);
        this.txntkn = D["txnToken"],
        this.MID = D["merchant"]["mid"];
        await this.send_upi_collect_request();
        return "Paytm PG Landing Page Loaded Successfully";
    }
    async send_upi_collect_request(){
        const {oid,txntkn,MID,upiid} = this;
        const tmp = new Date().getTime();
        const data = {
            'head': {
                'version': 'v1',
                'requestTimestamp': tmp,
                'channelId': 'WEB',
                'txnToken': txntkn,
                'workFlow': 'enhancedCashierFlow',
                'token': txntkn,
                'tokenType': 'TXN_TOKEN'
            },
            'body': {
                'paymentMode': 'UPI',
                'payerAccount': upiid,
                'requestType': 'NATIVE',
                'authMode': '3D',
                'mid': MID,
                'orderId': oid,
                'paymentFlow': 'NONE',
                'selectedPaymentModeId': "2",
                'riskExtendInfo': "userAgent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0|timeZone:Asia/Calcutta|operationType:PAYMENT|refererURL:https://securegw.paytm.in/|businessFlow:STANDARD|amount:32.25|merchantType:offus|language:en-US|screenResolution:1536X864|networkType:4g|osType:Windows|osVersion:10|platform:WEB|channelId:WEB|deviceType:Desktop|browserType:Edge|browserVersion:123.0.0.0|"
            },
            'showPostFetchLoader': false
        };
        const data_string = JSON.stringify(data);
        const action_url = `https://secure.paytmpayments.com/theia/api/v1/processTransaction?mid=${MID}&orderId=${oid}`;
        const headers = main_headers.headers_14;
        headers['Content-Length'] = data_string.length.toString();
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        const response = await this.axios_instance.post(
            action_url,
            data_string,
            {
                headers: headers,
            }
        );
        const y = response.data;
        if (y["body"]["resultInfo"]["resultStatus"] == "F"){
            throw new Error(y["body"]["resultInfo"]["resultMsg"])
        }
        else{
            console.log(`---> INFO <---\nPlease approve the UPI Collect request from the UPI ID ${y["body"]["content"]["MERCHANT_VPA"]} for INR ${y["body"]["content"]["TXN_AMOUNT"]} with payment remarks as \'Oid${y["body"]["content"]["ORDER_ID"]}@IRCTCWebUPI\' in your ${y["body"]["content"]["upiHandleInfo"]["upiAppName"]} app`);
        }
        this.paycon = y["body"]["content"];
        await this.get_upi_transaction_status();
        // await this.get_completed_payment_params();
        return "UPI Collect Request Sent Successfully";
    }
    async get_upi_transaction_status(){
        const data ={
            merchantId: this.MID,
            orderId: this.oid,
            transId: this.paycon.transId,
            paymentMode: 'UPI',
            cashierRequestId: this.paycon.cashierRequestId
        };
        const data_string = querystring.stringify(data);
        const headers = main_headers.headers_15;
        const action_url = this.paycon.upiStatusUrl;
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        headers["Content-Length"] = data_string.length.toString();
        while (true){
            let response = await this.axios_instance.post(
                action_url,
                data_string,
                {
                    headers: headers,
                }
            );
            let Z = response.data;
            let poll_stat = Z["POLL_STATUS"];
            if (poll_stat !== "POLL_AGAIN"){
                break;
            }
        }
        await this.get_completed_payment_params();
        return "UPI Transaction Status Fetched Successfully";
    }
    async get_completed_payment_params(){
        // await input("Type Anything below and press enter after completing the payment in your UPI App");
        const{oid,MID} = this;
        const data_string = querystring.stringify(this.paycon);
        const headers = main_headers.headers_16;
        headers.Referer = `https://secure.paytmpayments.com/theia/transactionStatus?MID=${MID}&ORDER_ID=${oid}`;
        headers["Content-Length"] = data_string.length.toString();
        const action_url = `https://secure.paytmpayments.com/theia/transactionStatus??MID=${MID}&ORDER_ID=${oid}`;
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        headers["Content-Length"] = data_string.length.toString();
        const response = await this.axios_instance.post(
            action_url,
            data_string,
            {
                headers: headers
            }
        );
        const xx = response.data;
        if (xx.includes('pushAppData="')){
            this.paytm_params_d = xx;
            console.log("Trying payment again due to unsuccessful transaction")
            await this.paytm_pg_landing_page();
        }
        else{
            this.callback_data = xx;
            await this.callback_to_irctc();
            return "IRCTC CallBack Payment Details Fetched Successfully";
        }
    }
    async callback_to_irctc(){
        var $ = cheerio.load(this.callback_data),
        form = $('form[name="TESTFORM"]'),
        action_url = form.attr('action'),
        input_elements = form.find('input'),
        body_data = {};
        input_elements.each((index, element) => {
            const raw_variable = $(element).attr('value');
            body_data[$(element).attr('name')] = raw_variable;
        });
        const data = querystring.stringify(body_data);
        const headers = main_headers.headers_17;
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        headers["Content-Length"] = data.length.toString();
        try{
            const response = await this.axios_instance.post(
                action_url,
                data,
                {
                    headers: headers,
                    maxRedirects: 0
                }
            );
            return "IRCTC CallBack Payment Successful";
        }
        catch(e){
            const response = await this.axios_instance.get(
                e.response.headers.location,
                {
                    headers: main_headers.headers_18,
                }
            );
            return "IRCTC CallBack Payment Successful";
        }
    }
    async get_booking_details(){
        const action_url = `https://www.wps.irctc.co.in/eticketing/protected/mapps1/bookingData/${this.tid}`;
        const headers = main_headers.headers_19;
        headers.bmiyek = this.user_hash;
        headers.greq = this.captcha_status;
        headers["spa-csrf-token"] = "" + (new Date).getTime();
        headers.Authorization = this.access_token;
        const response = await this.axios_instance.get(
            action_url,
            {
                headers: headers,
            }
        );
        const data = response.data;
        return data;
    }
    async book(params){
        this.params = params;
        await verify_booking_params(this.params);
        initialize_booking_variables(this);
        await this.load_irctc();
        await this.sign_in();
        await this.get_trains();
        await this.get_class_availability();
        await this.fill_booking_details();
        await this.confirm_booking();
        await this.select_paytm_upi_gateway();
        const response = await this.get_booking_details();
        return response;
    }
    async last_transaction_depth(){
        const action_url = `https://www.irctc.co.in/eticketing/protected/mapps1/historySearchByTxnId/${this.profile_last_tid}?currentStatus=L`;
        const headers = main_headers.headers_22;
        headers.Authorization = this.access_token;
        headers.greq = this.captcha_status;
        headers.bmiyek = this.user_hash;
        headers["spa-csrf-token"] = this.csrf_token;
        headers["Referer"] = `https://www.irctc.co.in/nget/enquiry/last-book-ticket?txnId=${this.profile_last_tid}`;
        const response = await this.axios_instance.get(
            action_url,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        return response.data;
    }
    async last_transaction(params){
        this.params = {};
        this.params.ticket_time = 0;
        this.username = params.userID;
        this.password = btoa(params.password);
        await this.load_irctc();
        await this.sign_in();
        const headers = main_headers.headers_20;
        headers.Authorization = this.access_token;
        headers.greq = this.captcha_status;
        headers.bmiyek = this.user_hash;
        const action_url = "https://www.irctc.co.in/eticketing/protected/mapps1/recentTxnsDetails";
        const response = await this.axios_instance.get(
            action_url,
            {
                headers: headers,
            }
        );
        this.profile_last_tid = response.data.lastTxnList[0].transactionId;
        const new_data = await this.last_transaction_depth();
        return new_data;
    }
    async pnr_status(params){
        this.pnr = params.pnr;
        this.params = {};
        this.params.ticket_time = 0;
        this.username = params.userID;
        this.password = btoa(params.password);
        await this.load_irctc();
        await this.sign_in();
        const headers = main_headers.headers_21;
        headers.Authorization = this.access_token;
        headers.greq = this.captcha_status;
        headers.bmiyek = this.user_hash;
        headers["spa-csrf-token"] = this.csrf_token;
        const action_url = `https://www.irctc.co.in/eticketing/protected/mapps1/pnrenq/${this.pnr}?pnrEnqType=E`;
        const response = await this.axios_instance.get(
            action_url,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        return data;
    }
};
export {IRCTC as main_class};