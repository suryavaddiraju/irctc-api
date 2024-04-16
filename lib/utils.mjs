import fs from 'fs';
import readline from 'readline';
import {start_before_3_minutes} from "./time_work.mjs";
import { stations_list } from './stations.mjs';
async function verify_booking_params(params) {
    let stationsList = stations_list;
    if (!params.quota || !params.class || !params.train_number || !params.journey_date || !params.from || !params.to || !params.userID || !params.password || !params.passengers || !params.UPI || !params.mobile_number) {
        throw new Error("Missing parameters\nThe required parameters are quota, class, train_number, journey_date, from, to, userID, password, passengers, UPI, mobile_number");
    }
    else if (typeof params.quota !== "string" || params.quota.length !== 2 || !["GN","TQ","PT"].includes(params.quota)){
        throw new Error("Invalid quota parameter");
    }
    else if (typeof params.class !== "string" || params.class.length !== 2 || !["1A","2A","3A","3E","EC","CC","FC","SL","2S"].includes(params.class)){
        throw new Error("Invalid class parameter");
    }
    else if (typeof params.train_number !== "string" || params.train_number.length !== 5){
        throw new Error("Invalid train_number parameter");
    }
    else if (typeof params.journey_date !== "string" || params.journey_date.length !== 8){
        throw new Error("Invalid journey_date parameter");
    }
    else if (typeof params.from !== "string" || params.from.length < 2 || params.from.length > 4 || !stationsList.includes(params.from)){
        throw new Error("Invalid from parameter");
    }
    else if (typeof params.to !== "string" || params.to.length < 2 || params.to.length > 4 || !stationsList.includes(params.to)){
        throw new Error("Invalid to parameter");
    }
    else if (typeof params.userID !== "string" || params.userID.length === 0){
        throw new Error("Invalid userID parameter");
    }
    else if (typeof params.password !== "string" || params.password.length === 0){
        throw new Error("Invalid password parameter");
    }
    else if (!Array.isArray(params.passengers) || params.passengers.length === 0 || params.passengers.length > 6){
        throw new Error("Invalid passengers parameter");
    }
    else if (typeof params.UPI !== "string" || params.UPI.length < 4 || !params.UPI.includes("@")){
        throw new Error("Invalid UPI parameter");
    }
    else if (typeof params.mobile_number !== "string" || params.mobile_number.length !== 10){
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
        
        food.push(passenger['food']);

        // Add the passenger details to the list
        passengers.push(passengerDetails);
    }

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
async function verify_txn_params(params){
    if (!params.userID || !params.password) {
        throw new Error("Missing parameters\nThe required parameters are quota, class, train_number, journey_date, from, to, userID, password, passengers, UPI, mobile_number");
    }
    else if (typeof params.userID !== "string" || params.userID.length === 0){
        throw new Error("Invalid userID parameter");
    }
    else if (typeof params.password !== "string" || params.password.length === 0){
        throw new Error("Invalid password parameter");
    }
    else{
        return "done";
    }
}
async function initialize_txn_variables(params){
    params.username = params.params.userID;
    params.password = btoa(params.params.password);
    return "Done";
}
export {verify_booking_params, initialize_booking_variables, input, base64DecodeUnicode, verify_txn_params, initialize_txn_variables}