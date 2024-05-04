import {IRCTC} from "irctc-api";
const params = {
    "UPI": "9876543210@paytm",
    "class": "2S",
    "quota": "GN",
    "train_number": "17201",
    "from": "GNT",
    "to": "PDKN",
    "journey_date": "20240530",
    "mobile_number": "9876543210",
    "userID": "XXXXXX",
    "password": "XXXXXXXXX",
    "passengers": [
        {
            "age": "22",
            "food": "",
            "name": "Virat Kohli",
            "sex": "M"
        },
    ],
    "log": true
};
async function custom_command_name(params) {
    const irctc = new IRCTC();
    const response = await irctc.book(params);
    console.log(response);
};
await custom_command_name(params);