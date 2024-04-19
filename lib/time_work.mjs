function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep_for_login(ticket_time){
    if (ticket_time === 1 || ticket_time === 2){
        if (ticket_time === 1){
            const targetTime = new Date();
            targetTime.setHours(9, 58, 0, 0); // Set target time to 09:58:00.000 AM
            const currentTime = new Date();
            if (currentTime < targetTime) {
                await sleep(targetTime - currentTime);
            }
            else{
                return "No Sleep Required";
            }
        }
        else if (ticket_time === 2){
            const targetTime = new Date();
            targetTime.setHours(10, 58, 0, 0); // Set target time to 10:58:00.000 AM
            const currentTime = new Date();
            if (currentTime < targetTime) {
                await sleep(targetTime - currentTime);
            }
            else{
                return "No Sleep Required";
            }
        }
        else{
            throw new Error("Invalid ticket_time parameter");
        }
    }
    else{
        return "No Sleep Required";
    }
}

async function sleep_for_availability_check(ticket_time){
    if (ticket_time === 1 || ticket_time === 2){
        if (ticket_time === 1){
            const targetTime = new Date();
            targetTime.setHours(10, 0, 1, 0); // Set target time to 10:00:00.000 AM
            const currentTime = new Date();
            if (currentTime < targetTime) {
                await sleep(targetTime - currentTime);
            }
        }
        if (ticket_time === 2){
            const targetTime = new Date();
            targetTime.setHours(11, 0, 1, 0); // Set target time to 11:00:00.000 AM
            const currentTime = new Date();
            if (currentTime < targetTime) {
                await sleep(targetTime - currentTime);
            }
        }
        else{
            throw new Error("Invalid ticket_time parameter");
        }
    }
    else{
        return "No Sleep Required";
    }
}
function start_before_3_minutes(ticket_time){
    if (ticket_time === 1) {
        const targetTime = new Date();
        targetTime.setHours(9, 57, 0, 0);
        const currentTime = new Date();
        if (currentTime < targetTime) {
            throw new Error("Please Start the booking after 09:57:00.000 AM");
        }
        else{
            return "Proceeding to Book Tickets";
        }
    }
    else if (ticket_time === 2) {
        const targetTime = new Date();
        targetTime.setHours(10, 57, 0, 0);
        const currentTime = new Date();
        if (currentTime < targetTime) {
            throw new Error("Please Start the booking after 10:57:00.000 AM");
        }
        else{
            return "Proceeding to Book Tickets";
        }
    }
    else{
        return "Proceeding to Book Tickets";
    }
}
export {sleep, sleep_for_login, sleep_for_availability_check, start_before_3_minutes};