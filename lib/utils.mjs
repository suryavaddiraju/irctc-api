import readline from 'readline';
import {start_before_3_minutes} from "./time_work.mjs";
import { stations_list } from './stations.mjs';
async function verify_booking_params(params) {
    let stationsList = stations_list;
    if (!params.quota || !params.class || !params.train_number || !params.journey_date || !params.from || !params.to || !params.userID || !params.password || !params.passengers || !params.UPI || !params.mobile_number) {
        throw new Error("Missing parameters\nThe required parameters are quota, class, train_number, journey_date, from, to, userID, password, passengers, UPI, mobile_number");
    }
    if (typeof params.quota !== "string" || params.quota.length !== 2 || !["GN","TQ","PT"].includes(params.quota)){
        throw new Error("Invalid quota parameter");
    }
    if (typeof params.class !== "string" || params.class.length !== 2 || !["1A","2A","3A","3E","EC","CC","FC","SL","2S"].includes(params.class)){
        throw new Error("Invalid class parameter");
    }
    if (typeof params.train_number !== "string" || params.train_number.length !== 5){
        throw new Error("Invalid train_number parameter");
    }
    if (typeof params.journey_date !== "string" || params.journey_date.length !== 8){
        throw new Error("Invalid journey_date parameter");
    }
    if (typeof params.from !== "string" || params.from.length < 2 || params.from.length > 4 || !stationsList.includes(params.from)){
        throw new Error("Invalid from parameter");
    }
    if (typeof params.to !== "string" || params.to.length < 2 || params.to.length > 4 || !stationsList.includes(params.to)){
        throw new Error("Invalid to parameter");
    }
    if (typeof params.userID !== "string" || params.userID.length === 0){
        throw new Error("Invalid userID parameter");
    }
    if (typeof params.password !== "string" || params.password.length === 0){
        throw new Error("Invalid password parameter");
    }
    if (!Array.isArray(params.passengers) || params.passengers.length === 0 || params.passengers.length > 6){
        throw new Error("Invalid passengers parameter");
    }
    if (typeof params.UPI !== "string" || params.UPI.length < 4 || !params.UPI.includes("@")){
        throw new Error("Invalid UPI parameter");
    }
    if (typeof params.mobile_number !== "string" || params.mobile_number.length !== 10){
        throw new Error("Invalid mobile_number parameter");
    }
    for (let passenger of params.passengers) {
        if (!('food' in passenger) || !('name' in passenger) || !('sex' in passenger) || !('age' in passenger)){
            throw new Error("Invalid passengers parameter");
        } else if (typeof passenger.name !== 'string' || passenger.name.length === 0) {
            throw new Error("Invalid name parameter");
        } else if (typeof passenger.age !== 'string' || passenger.age.length === 0 || parseInt(passenger.age, 10) < 5 || parseInt(passenger.age, 10) > 125) {
            throw new Error("Invalid age parameter");
        } else if (typeof passenger.sex !== 'string' || !["M", "F", "T"].includes(passenger.sex)) {
            throw new Error("Invalid Gender/Sex Parameter");
        } else if (typeof passenger.food !== 'string' || !["V", "N", "D", ""].includes(passenger.food)) {
            throw new Error("Invalid food parameter");
        }
    }
    if ("gst" in params) {
        if (params.gst && typeof params.gst === "object"){
            if (params.gst.hasOwnProperty("gstin")){
                if (typeof params.gst.gstin === "string" && params.gst.gstin.length === 15){
                    if (!gst_check(params.gst.gstin)){
                        throw new Error("Invalid gstin");
                    }
                }
                else{
                    throw new Error("Invalid gstin parameter");
                }
            }
            else{
                throw new Error("gstin number is mandatory in gst object");
            }
            if (params.gst.hasOwnProperty("pincode")){
                if (typeof params.gst.pincode === "string" && params.gst.pincode.length === 6){
                    const posrtalCode = /^[1-9][0-9]{5}$/;
                    if (!posrtalCode.test(params.gst.pincode)){
                        throw new Error("Invalid postal code");
                    }
                }
                else{
                    throw new Error("Invalid pincode parameter");
                }
            }
            else{
                throw new Error("pincode number is mandatory in gst object");
            }
        }
        else{
            throw new Error("Invalid gst parameter");
        }
    }
    if (["TQ", "PT"].includes(params.quota) && ["2A","3A","EC","CC","3E"].includes(params.class)){
        params.ticket_time = 1;
    }
    else if (["TQ", "PT"].includes(params.quota) && ["FC","SL","2S"].includes(params.class)){
        params.ticket_time = 2;
    }
    else{
        params.ticket_time = 0;
    }
    if (params.ticket_time === 1 || params.ticket_time === 2) {
        if (params.passengers.length > 4){
            throw new Error("Please book only upto 4 tickets for the selected quota. For booking more than 4 tickets, please use the GN quota. Tatkal Bookings allow only 4 tickets per PNR.");
        }
        start_before_3_minutes(params.ticket_time);
    }
}
function generatePassenger(params) {
    let passengersList = params.params.passengers;
    let passengers = [];
    let passengerTemplate = {
        'passengerName': '',
        'passengerAge': '',
        'passengerGender': '',
        'passengerBerthChoice': '',
        'passengerFoodChoice': null,
        'passengerBedrollChoice': null,
        'passengerNationality': 'IN',
        'passengerCardTypeMaster': null,
        'passengerCardNumberMaster': null,
        'psgnConcType': null,
        'psgnConcCardId': null,
        'psgnConcDOB': null,
        'psgnConcCardExpiryDate': null,
        'psgnConcDOBP': null,
        'softMemberId': null,
        'softMemberFlag': null,
        'psgnConcCardExpiryDateP': null,
        'passengerVerified': false,
        'masterPsgnId': null,
        'mpMemberFlag': null,
        'passengerForceNumber': null,
        'passConcessionType': '0',
        'passUPN': null,
        'passBookingCode': null,
        'passengerSerialNumber': '',
        'childBerthFlag': true,
        'passengerCardType': 'NULL_IDCARD',
        'passengerIcardFlag': false,
        'passengerCardNumber': null
    };
    
    let count = 0;
    let food = [];

    for (let passenger of passengersList) {
        count += 1;
        let passengerDetails = { ...passengerTemplate };

        // Update values for each passenger
        passengerDetails['passengerSerialNumber'] = count;
        passengerDetails['passengerName'] = passenger['name'].slice(0, 16);
        passengerDetails['passengerAge'] = parseInt(passenger['age'], 10);
        passengerDetails['passengerGender'] = passenger['sex'];
        
        if (passenger['food'] !== '') {
            passengerDetails['passengerFoodChoice'] = passenger['food'];
        }
        if (passenger['berth']) {
            passengerDetails['passengerBerthChoice'] = passenger['berth'];
        }
        if (passenger["country"]){
            passengerDetails['passengerNationality'] = passenger["country"];
        }

        food.push(passenger['food']);

        // Add the passenger details to the list
        passengers.push(passengerDetails);
    }
    params.psg_count = count;
    let foodList = [...new Set(food)];

    if (foodList.includes('') && foodList.length > 1) {
        throw new Error('Food choice must be either "" for all passengers or different for each passenger. If different, no passenger should have "" present in the food parameter.');
    } else {
        params.foodList = foodList;
    }
    return passengers;
};
async function initialize_booking_variables(params){
    params.passengers = generatePassenger(params);
    params.class_type = params.params.class;
    params.train_number = params.params.train_number;
    params.journey_date = params.params.journey_date;
    params.from_stn = params.params.from;
    params.to_stn = params.params.to;
    params.username = params.params.userID;
    params.password = btoa(params.params.password);
    params.quota_type = params.params.quota;
    params.upiid = params.params.UPI;
    params.mobile_number = params.params.mobile_number;
    if (params.params.gst){
        params.gst = params.params.gst;
    }
}
function input(prompt) {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
function base64DecodeUnicode(e) {
    for (var o = atob(e).split(""), a = 0; a < o.length; a++)
        o[a] = "%" + ("00" + o[a].charCodeAt(0).toString(16)).slice(-2);
    return decodeURIComponent(o.join(""))
}

function gst_check(value) {
    const regex = /^([0-2][0-9]|[3][0-7])[A-Z]{3}[ABCFGHLJPTK][A-Z]\d{4}[A-Z][A-Z0-9][Z][A-Z0-9]$/;
    return regex.test(value) && gstChecksum(value);
}
function gstChecksum(value) {
    if (!/^[0-9A-Z]{15}$/.test(value)) {
        return false;
    }
    const chars = [...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const values = [...value];
    const lastChar = values.pop();
    const sum = values
        .map((char, index) => {
        const product = chars.indexOf(char) * (index % 2 !== 0 ? 2 : 1);
        return Math.floor(product / chars.length) + (product % chars.length);
    })
        .reduce((prev, current) => {
        return prev + current;
    });
    const checksum = (chars.length - (sum % chars.length)) % chars.length;
    return chars[checksum] === lastChar;
}
export {verify_booking_params, initialize_booking_variables, input, base64DecodeUnicode}