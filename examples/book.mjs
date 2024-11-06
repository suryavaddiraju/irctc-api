import {IRCTC} from "irctc-api";

async function custom_function_name() {
    const irctc = new IRCTC({
        "userID": "XXXXX", // Secret User ID
        "password": "XXXXXXXXX", // Secret Password
    });
    const params = {
        "payment": "9876543210@pthdfc", // Your NPCI UPI VPA ID
        "class": "2S", // class code such as 2A | 3A | SL | CC | 2S | FC | 1A | 3E | Any other valid class code
        "quota": "GN", // GN | TQ | PT | any other valid quota code
        "train": "17201", // 5 Digit Train Number - string
        "from": "GNT", // Station code
        "to": "PDKN", // Station code
        "date": "20241231", // YYYYMMDD
        "mobile": "9876543210", // 10 Digit Mobile Number
        "passengers": [ // Passengers List - Max 4 members for Tatkal and 6 for General Quota
            {
                "age": 40, // Age of Passenger - Integer
                "name": "Virat Kohli", // Full Name of Passenger
                "gender": "M" // Gender of Passenger - M | F | T
            },
            {
                "age": 40, // Age of Passenger - Integer
                "name": "Anushka Sharma", // Full Name of Passenger
                "gender": "F" // Gender of Passenger - M | F | T
            }
        ]
    };
    const response = await irctc.book(params);
    return response;
};
const ticket = await custom_function_name();
console.log(ticket);