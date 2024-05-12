import {get_current_time_api} from "./time_work.mjs";
import {appendFile} from "fs";
class LOG {
    constructor(log = false, filename = "") {
        this.log = log;
        if (filename === "") {
            this.generate_filename();
        }
        else {
            this.filename = filename;
        }
    }
    async generate_filename(){
        const timestamp = await get_current_time_api();
        const sfilename = timestamp.replaceAll("-","").replaceAll(":","").replaceAll("T","").replaceAll(".","").replaceAll("+0000","")
        this.filename = `./${sfilename}.log`;
    }
    async log_function(message,level="INFO"){
        if (this.log){
            const online_time = await get_current_time_api();
            const log_message = {
                local_timestamp: new Date().toISOString(),
                online_timestamp: online_time.slice(0, -9)+"Z",
                log_level:level,
                message: message
            };
            appendFile(this.filename, JSON.stringify(log_message)+"\n", (err) => err && console.error(err));
        }
    }
}
export {LOG};