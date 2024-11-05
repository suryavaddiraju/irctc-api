import { stations as stlist } from './stations.mjs';
import {countries as countries_list} from "./countries.mjs";

async function create_gst(gstin="",class_instance={}){
    const returnable ={
        "gstIn": "",
        "error": null
    };
    let response = await class_instance.browse.request(`https://app.signalx.ai/apps/gst-verification/gstin-overview/${gstin}`);
    if (response.statusCode != 200){
        throw new Error("Failed to fetch GST details: Request you to proceed without GST details");
    }else{
        const body = response.body;
        if (body.legal_business_name=== ""){
            throw new Error("Invalid GSTIN number: Check the GSTIN number and try again or proceed without GST details");
        }else{
            const pincode = body.principal_place_of_business.match(/,\s([1-9][0-9]{5}),/g)[0].split(", ")[1].split(",")[0];
            response = await class_instance.browse.request(`https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&filters%5Bpincode%5D=${pincode}`,{headers:{'accept': 'application/json'}});
            if (response.statusCode !== 200){
                console.error("Registered Address Pincode Error: Proceeding without GST details");
                return returnable;
            }else{
                const postbody = response.body.records[0];
                const gstobj = {
                    "gstIn":gstin,
                    "nameOnGst":body.legal_business_name,
                    "flat":postbody.divisionname,
                    "street":"",
                    "area":"",
                    "pin":pincode,
                    "state":postbody.statename,
                    "city":postbody.district,
                    "error":null
                };
                if (gstobj.gstIn && gstobj.nameOnGst && gstobj.flat && gstobj.pin && gstobj.state && gstobj.city){
                    return gstobj;
                }
                else{
                    return returnable;
                }
            }
        }
    }
}

async function book_validator(params,class_instance){
    if(!(Object.prototype.hasOwnProperty.call(params,"quota") && typeof params.quota === "string" && params.quota.length === 2 && ['GN','SS','TQ','LD','PT','HP','PH','FT','DP','HO'].includes(params.quota))){
        throw new TypeError("Invalid quota parameter");
    }
    if(!(Object.prototype.hasOwnProperty.call(params,"class") && typeof params.class === "string" && params.class.length === 2 && ["VC","EV","EA","EC","1A","2A","3A","3E","CC","FC","SL","2S","VS"].includes(params.class))){
        throw new TypeError("Invalid class parameter");
    }
    if(!(Object.prototype.hasOwnProperty.call(params,"train") && typeof params.train === "string" && params.train.length === 5)){
        throw new TypeError("Invalid train parameter");
    }
    if(!(Object.prototype.hasOwnProperty.call(params,"date") && typeof params.date === "string" && params.date.length === 8)){
        throw new TypeError("Invalid date parameter");
    }
    if(!(Object.prototype.hasOwnProperty.call(params,"from") && typeof params.from === "string" && stlist.includes(params.from))){
        throw new TypeError("Invalid from parameter");
    }
    if(!(Object.prototype.hasOwnProperty.call(params,"boarding") && typeof params.boarding === "string" && stlist.includes(params.boarding))){
        params.boarding = params.from;
    }
    if(!(Object.prototype.hasOwnProperty.call(params,"to") && typeof params.to === "string" && stlist.includes(params.to))){
        throw new TypeError("Invalid to parameter");
    }
    if(!(Object.prototype.hasOwnProperty.call(params,"mobile") && typeof params.mobile === "string" && params.mobile.length === 10)){
        throw new TypeError("Invalid mobile parameter");
    }
    if (!(Object.prototype.hasOwnProperty.call(params,"payment") && typeof params.payment === "string")){
        throw new TypeError("Invalid payment parameter");
    }else{
        if(params.payment.length > 3 && params.payment.includes("@")){
            params.payment_type = "2";
        }
        else if(params.payment === "wallet"){
            params.payment_type = "3";
        }
        else{
            throw new TypeError("Invalid payment parameter");
        }
    }
    let passengerList = [];
    let infantList = [];
    if(Object.prototype.hasOwnProperty.call(params,"passengers") && Array.isArray(params.passengers) && params.passengers.length > 0 && params.passengers.length < 9){
        let passengerSerialNumber = 0;
        let infantSerialNumber = 0;
        for (const passenger of params.passengers){
            const passenger_map = {
                "passengerFoodChoice":null,
                "passengerBedrollChoice":null,
                "passengerNationality":"IN",
                "psgnConcType":null,
                "psgnConcCardId":null,
                "psgnConcDOB":null,
                "psgnConcCardExpiryDate":null,
                "softMemberId":null,
                "softMemberFlag":null,
                "psgnConcCardExpiryDateP":null,
                "mpMemberFlag":null,
                "passengerForceNumber":null,
                "passConcessionType":"0",
                "passUPN":null,
                "passBookingCode":null,
                "childBerthFlag":true,
                "passengerCardNumber":null,
                "passengerName":"",
                "passengerAge":0,
                "passengerGender":"",
                "passengerBerthChoice":"",
                "passengerCardTypeMaster":null,
                "passengerCardNumberMaster":null,
                "psgnConcDOBP":null,
                "passengerVerified":false,
                "masterPsgnId":null,
                "passengerSerialNumber":0,
                "passengerCardType":"NULL_IDCARD",
                "passengerIcardFlag":false,
            };
            if(Object.prototype.hasOwnProperty.call(passenger,"masterListId") && Object.prototype.hasOwnProperty.call(passenger,"idCardType") && Object.prototype.hasOwnProperty.call(passenger,"dateOfBirth") && Object.prototype.hasOwnProperty.call(passenger,"verificationStatusString")){
                passenger_map["passengerCardTypeMaster"] = passenger["idCardType"];
                passenger_map["passengerCardNumberMaster"] = "";
                passenger_map["psgnConcDOBP"] = passenger["dateOfBirth"];
                if(passenger["verificationStatusString"] === "Verified"){
                    passenger_map["passengerVerified"] = true;
                }
                passenger_map["masterPsgnId"] = passenger["masterListId"];
                passenger_map["passengerCardType"] = passenger["idCardType"];
                passenger_map["passengerIcardFlag"] = true;
            }
            if(Object.prototype.hasOwnProperty.call(passenger,"name") && typeof passenger.name === "string" && passenger.name.length > 2){
                passenger_map["passengerName"] = passenger["name"].slice(0, 16);
            }else{
                throw new TypeError("Invalid name parameter");
            }
            if(Object.prototype.hasOwnProperty.call(passenger,"age") && typeof passenger.age === "number" && passenger.age >= 0 && passenger.age < 126){
                passenger_map["passengerAge"] = passenger["age"];
            }else{
                throw new TypeError("Invalid age parameter");
            }
            if(Object.prototype.hasOwnProperty.call(passenger,"gender") && typeof passenger.gender === "string" && passenger.gender.length === 1 && ["M","F","T"].includes(passenger.gender)){
                passenger_map["passengerGender"] = passenger["gender"];
            }else{
                throw new TypeError("Invalid gender parameter");
            }
            if(Object.prototype.hasOwnProperty.call(passenger,"berth")){
                if(!(typeof passenger.berth === "string" && ["LB","MB","UB","SL","SU","SS","SU","WS"].includes(passenger.berth))){
                    throw new TypeError("Invalid berth parameter");
                }else{
                    passenger_map["passengerBerthChoice"] = passenger["berth"];
                }
            }
            if(Object.prototype.hasOwnProperty.call(passenger,"nation") && passenger.nation != "IN" && countries_list.includes(passenger.nation)){
                passenger_map["passengerNationality"] = passenger["nation"];
                if(Object.prototype.hasOwnProperty.call(passenger,"passport") && typeof passenger.passport === "string" && 5 < passenger.passport.length && passenger.passport.length < 10){
                    passenger_map["passengerCardNumber"] = passenger["passport"];
                    passenger_map["passengerCardType"] = "PASSPORT";
                    passenger_map["passengerIcardFlag"] = true;
                }else{
                    throw new TypeError("Provide a passport parameter");
                }
                if(Object.prototype.hasOwnProperty.call(passenger,"DOB") && typeof passenger.DOB === "string" && passenger.DOB.length === 8){
                    passenger_map["psgnConcDOB"] = passenger["DOB"];
                    const dob = passenger["DOB"];
                    const psgnConcDOBP_ist = new Date(`${dob.slice(0, 4)}-${dob.slice(4, 6)}-${dob.slice(6,8)}T00:00:00.000+05:30`);
                    passenger_map["psgnConcDOBP"] = new Date(psgnConcDOBP_ist.getTime() - (5.5 * 60 * 60 * 1000));
                }else{
                    throw new TypeError("Provide a DOB parameterin YYYYMMDD format");
                }
            }
            if (passenger_map["passengerAge"] >= 0 && passenger_map["passengerAge"] < 5){
                infantSerialNumber += 1;
                if (infantSerialNumber > 2){
                    throw new TypeError("Maximum 2 infants are allowed per booking");
                }
                infantList.push({
                    "name":passenger_map["passengerName"],
                    "gender":passenger_map["passengerGender"],
                    "age":passenger_map["passengerAge"],
                    "infantSerialNumber":infantSerialNumber
                });
            }else{
                passengerSerialNumber += 1;
                if (passengerSerialNumber > 6){
                    throw new TypeError("Maximum 6 passengers are allowed per booking");
                }
                if (passengerSerialNumber > 4 && ['TQ','PT'].includes(params.quota)){
                    throw new TypeError("Maximum 4 passengers are allowed for Tatkal and Premium Tatkal Quota");
                }
                passenger_map["passengerSerialNumber"] = passengerSerialNumber;
                passengerList.push(passenger_map);
            }
        }
    }else{
        throw new TypeError("Invalid passengers parameter");
    }
    if(!(Object.prototype.hasOwnProperty.call(params,"coach") && typeof params.coach === "string")){
        params.coach = null;
    }
    if(Object.prototype.hasOwnProperty.call(params,"gst")){
        const gstpattern = /^([0-2][0-9]|[3][0-8]|[9][7]|[9][9])[A-Z]{3}[ABCFGHLJPTK][A-Z]\d{4}[A-Z][A-Z0-9][Z][A-Z0-9]$/;
        if(!(typeof params.gst === "string" && params.gst.length === 15 && gstpattern.test(params.gst))){
            throw new TypeError("Invalid gst parameter: It must be a string consisting of 15 characters GSTIN Number");
        }else{
            params.gst = await create_gst(params.gst,class_instance);
        }
    }else{
        params.gst = {
            "gstIn": "",
            "error": null
        }
    }
    const new_map = {
        "clusterFlag":"N",
        "onwardFlag":"N",
        "cod":"false",
        "reservationMode":"WS_TA_B2C",
        "autoUpgradationSelected":true,
        "gnToCkOpted":false,
        "paymentType":params.payment_type,
        "twoPhaseAuthRequired":false,
        "captureAddress":0,
        "wsUserLogin":class_instance.userID,
        "moreThanOneDay":false,
        "clientTransactionId":params.tid,
        "boardingStation":params.boarding,
        "reservationUptoStation":params.to,
        "mobileNumber":params.mobile,
        "ticketType":"E",
        "mainJourneyTxnId":null,
        "mainJourneyPnr":"",
        "captcha":"",
        "generalistChildConfirm":false,
        "ftBooking":false,
        "loyaltyRedemptionBooking":false,
        "loyaltyBankId":null,
        "loyaltyNumber":null,
        "nosbBooking":false,
        "warrentType":0,
        "ftTnCAgree":false,
        "bookingChoice":1,
        "bookingConfirmChoice":1,
        "bookOnlyIfCnf":true,
        "returnJourney":null,
        "connectingJourney":false,
        "lapAvlRequestDTO":[
            {
                "trainNo":params.train,
                "journeyDate":params.date,
                "fromStation":params.from,
                "toStation":params.to,
                "journeyClass":params.class,
                "quota":params.quota,
                "coachId":params.coach,
                "reservationChoice":4,
                "ignoreChoiceIfWl":false,
                "travelInsuranceOpted":"true",
                "warrentType":0,
                "coachPreferred":false,
                "autoUpgradation":false,
                "bookOnlyIfCnf":true,
                "addMealInput":null,
                "concessionBooking":false,
                "passengerList":passengerList,
                "infantList":infantList,
                "ssQuotaSplitCoach":"N"
            }
        ],
        "gstDetails":params.gst
    };
    if (new_map["lapAvlRequestDTO"][0]["infantList"].length === 0){
        delete new_map["lapAvlRequestDTO"][0]["infantList"];
    }
    return new_map;
}
export {book_validator};
export default book_validator;
