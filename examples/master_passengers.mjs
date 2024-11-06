import {IRCTC} from "irctc-api";
const irctc = new IRCTC(
    {
        "userID": "XXXXX", // Secret User ID
        "password": "XXXXXXXXX", // Secret Password
    }
);
const response = await irctc.master_passengers();

// booking with master passengers list
const book_params = {
    "payment": "wallet",
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
            "gender": "M",
            "berth":"SL"
        },
        {
            "age": 40,
            "name": "Anushka Sharma",
            "gender": "F",
            "country":"US",
            "passport":"XYZ12345",
            "DOB":"19803112"
        },
        response[0] // additional passenger through master passenger list
    ],
    "gst":"33AAACB0482A1ZI",
    "coach":"D2"
};
const ticket = await irctc.book(book_params);
console.log(ticket);