import {IRCTC} from "irctc-api";
const params = {
    "UPI": "9876543210@ybl", // Your NPCI UPI VPA ID
    "class": "2S", // class code such as 2A | 3A | SL | CC | 2S | FC | 1A
    "quota": "GN", // GN | TQ | PT
    "train_number": "17201", // 5 Digit Train Number
    "from": "GNT", // Station code
    "to": "PDKN", // Station code
    "journey_date": "20240530", // YYYYMMDD
    "mobile_number": "9876543210", // 10 Digit Mobile Number
    "userID": "XXXXX", // Secret User ID
    "password": "XXXXXXX", // Secret Password
    "passengers": [ // Passengers List - Max 4 members for Tatkal and 6 for General Quota
        {
            "age": "22", // Age of Passenger
            "food": "", // Food Preference - Leave as Empty string, if food is not required
            "name": "Virat Kohli", // Full Name of Passenger
            "sex": "M" // Sex of Passenger - M | F
        },
        {
            "age": "21", // Age of Passenger
            "food": "", // Food Preference - Leave as Empty string, if food is not required
            "name": "Anushka Sharma", // Full Name of Passenger
            "sex": "F" // Sex of Passenger - M | F
        }
    ]
};
async function custom_command_name(params) {
    const irctc = new IRCTC();
    const response = await irctc.book(params);
    console.log(response);
};
await custom_command_name(params);