import {main_class} from "./lib/workings.mjs"
class IRCTC extends main_class{
    constructor(){
        super();
    }
    async book(params){
        return await super.book(params);
    }
    async last_transaction(params){
        return await super.last_transaction(params);
    }
    async pnr_status(params){
        return await super.pnr_status(params);
    }
};
export {IRCTC};