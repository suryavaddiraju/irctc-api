import {IRCTC} from "irctc-api";

async function custom_function_name() {
    const irctc = new IRCTC(
        {
            "userID": "XXXXX", // Secret User ID
            "password": "XXXXXXXXX", // Secret Password
        }
    );
    const response = await irctc.last_transaction();
    console.log(response);
}

const ticket = await custom_function_name(params);
console.log(ticket);