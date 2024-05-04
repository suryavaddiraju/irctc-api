import {IRCTC} from "irctc-api";
const params = {
    "userID": "XXXXX", // Secret User ID
    "password": "XXXXXXX", // Secret Password
    "pnr":"457544545" // PNR Number
};
async function custom_command_name(params) {
    try{
        const irctc = new IRCTC();
        const response = await irctc.pnr_status(params);
        console.log(response);
    }
    catch(e){
        throw new Error(e);
    }
}
await custom_command_name(params);