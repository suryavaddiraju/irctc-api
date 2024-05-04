import {IRCTC} from "irctc-api";
const params = {
    "userID": "XXXXX", // Secret User ID
    "password": "XXXXXXXXX", // Secret Password
};
async function custom_command_name(params) {
    try{
        const irctc = new IRCTC();
        const response = await irctc.last_transaction(params);
        console.log(response);
    }
    catch(e){
        throw new Error(e);
    }
}
await custom_command_name(params);