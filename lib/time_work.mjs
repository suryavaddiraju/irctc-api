import axios from "axios";
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function get_current_time_api(zone="utc"){
    if (zone === "utc"){
        const response = await axios.get(
            "https://worldtimeapi.org/api/timezone/Etc/UTC",
        );
        return response.data.utc_datetime;
    }
}

const psg_input_await = {
    1:20000,
    2:20000,
    3:25000,
    4:25000,
    5:30000,
    6:30000,
}

async function psg_input_wait(psg_count){
    const sleep_time = psg_input_await[psg_count];
    console.log(`Sleeping for ${sleep_time * 0.001} seconds for passenger details input.`);
    await sleep(sleep_time);
}

async function sleep_for_login(ticket_time){
    if (ticket_time === 1){
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        const targetTime = new Date(currentTime);
        targetTime.setUTCHours(4, 28, 0, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            console.log(`${balance_time} milliseconds left for login.\nSleeping for ${balance_time * 0.001} seconds to proceed for login.`);
            await sleep(balance_time);
            return "Proceeding to Login";
        }
        else{
            return "No Sleep Required";
        }
    }
    else if (ticket_time === 2){
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(5, 28, 0, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            console.log(`${balance_time} milliseconds left for login.\nSleeping for ${balance_time * 0.001} seconds to proceed for login.`);
            await sleep(balance_time);
            return "Proceeding to Login";
        }
        else{
            return "No Sleep Required";
        }
    }
    else{
        return "No Sleep Required";
    }
}

async function sleep_for_availability_check(ticket_time){
    if (ticket_time === 1){
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(4, 30, 1, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            console.log(`${balance_time} milliseconds left for availability check.\nSleeping for ${balance_time * 0.001} seconds to proceed for availability check.`);
            await sleep(balance_time);
            return "Proceeding to Check Availability";
        }
        else{
            return "No Sleep Required";
        }
    }
    else if (ticket_time === 2){
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(5, 30, 1, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            console.log(`${balance_time} milliseconds left for availability check.\nSleeping for ${balance_time * 0.001} seconds to proceed for availability check.`);
            await sleep(balance_time);
            return "Proceeding to Check Availability";
        }
        else{
            return "No Sleep Required";
        }
    }
    else{
        return "No Sleep Required";
    }
}

async function start_before_3_minutes(ticket_time){
    if (ticket_time === 1) {
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(4, 27, 0, 0);
        let stoptime = new Date(currentTime);
        stoptime.setUTCHours(18, 30, 0, 0);
        if (currentTime < targetTime || currentTime > stoptime) {
            throw new Error("Please Start the booking after 09:57:00.000 AM IST");
        }
        else{
            return "Proceeding to Book Tickets";
        }
    }
    else if (ticket_time === 2) {
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(5, 27, 0, 0);
        let stoptime = new Date(currentTime);
        stoptime.setUTCHours(18, 30, 0, 0);
        if (currentTime < targetTime || currentTime > stoptime) {
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

export {sleep, psg_input_wait, sleep_for_login, sleep_for_availability_check, start_before_3_minutes,get_current_time_api};