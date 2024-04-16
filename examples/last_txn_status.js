import {IRCTC} from "irctc-api";
const params = {
    "userID": "username_here", // Secret User ID
    "password": "someSecret_here", // Secret Password
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