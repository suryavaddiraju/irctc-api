import {IRCTC} from "irctc-api";

async function custom_function_name() {
    const irctc = new IRCTC({
        "userID": "XXXXX", // Secret User ID
        "password": "XXXXXXXXX", // Secret Password
    });
    const params = {
        "payment": "9876543210@pthdfc",
        "class": "2S",
        "quota": "GN",
        "train": "17201",
        "from": "GNT",
        "to": "PDKN",
        "date": "20241231",
        "mobile": "9876543210",
        "passengers": [
            {
                "age": 40,
                "name": "Virat Kohli",
                "gender": "M"
            },
            {
                "age": 40,
                "name": "Anushka Sharma",
                "gender": "F"
            }
        ]
    };
    const response = await irctc.book(params);
    return response;
};

const ticket = await custom_function_name();
console.log(ticket);