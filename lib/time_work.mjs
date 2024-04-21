function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep_for_login(ticket_time){
    if (ticket_time === 1 || ticket_time === 2){
        if (ticket_time === 1){
            const currentTime = new Date();
            const targetTime = new Date(currentTime);
            targetTime.setUTCHours(4, 28, 0, 0);
            if (currentTime < targetTime) {
                await sleep(targetTime - currentTime);
            }
            else{
                return "No Sleep Required";
            }
        }
        else if (ticket_time === 2){
            const currentTime = new Date();
            const targetTime = new Date(currentTime);
            targetTime.setUTCHours(5, 28, 0, 0);
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
            const currentTime = new Date();
            const targetTime = new Date(currentTime);
            targetTime.setUTCHours(4, 30, 1, 0);
            if (currentTime < targetTime) {
                await sleep(targetTime - currentTime);
            }
        }
        if (ticket_time === 2){
            const currentTime = new Date();
            const targetTime = new Date(currentTime);
            targetTime.setUTCHours(5, 30, 1, 0);
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
        const currentTime = new Date();
        const targetTime = new Date(currentTime);
        targetTime.setUTCHours(4, 27, 0, 0);
        if (currentTime < targetTime) {
            throw new Error("Please Start the booking after 09:57:00.000 AM IST");
        }
        else{
            return "Proceeding to Book Tickets";
        }
    }
    else if (ticket_time === 2) {
        const currentTime = new Date();
        const targetTime = new Date(currentTime);
        targetTime.setUTCHours(5, 27, 0, 0);
        if (currentTime < targetTime) {
            throw new Error("Please Start the booking after 10:57:00.000 AM IST");
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