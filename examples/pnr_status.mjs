import {IRCTC} from "irctc-api";

async function custom_function_name() {
    const irctc = new IRCTC({
        "userID": "XXXXX", // Secret User ID
        "password": "XXXXXXX", // Secret Password
    });
    const response = await irctc.pnr_status("455789456123");
    return response;
}

const ticket = await custom_function_name();
console.log(ticket);