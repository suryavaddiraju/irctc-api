---
layout: page
title: "API Reference"
permalink: /api_reference
---

To install the this package, simply type i or install irctc-api using the node package manager

```shell
npm install irctc-api
```

## Useful Links

<a href="https://github.com/suryavaddiraju/irctc-api"><img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub Logo" width="50" height="50"/></a> <a href="https://www.npmjs.com/package/irctc-api"><img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" alt="npm Logo" width="50" height="50"/></a> <a href="https://dev.vaddiraju.in/irctc-api/api_reference"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Read-the-docs.png/330px-Read-the-docs.png" alt="Documentation Logo" width="50" height="50"/></a>

## book

This is the heart of the package, where the whole intention for creation of this package is to book tickets in node js without use of any kind of drivers or browsers with simple input params and inbuilt payment completion capability.

Currently Payment through UPI is only supported

RoadMap to accept GST details is in process
[Example Usage](https://github.com/suryavaddiraju/irctc-api/blob/main/examples/book_ticket.js)

```js
// some_fuction.mjs
import {IRCTC} from "irctc-api";
const irctc = new IRCTC();
const params = {
    // refer book_input
};
const response = await irctc.book(params);
console.log(response);
```

## book_input

`book` function in IRCTC class takes input as a javascript object, where they are explained below

`Mandatory Keys`

- UPI 
    - Must be a string and have atleast three characters including `@`
    - Must be a active UPI ID issued under NPCI UPI Guidlines
    - It must be linked to atleast 1 bank account
    - It must be capable of handling UPI collect requests
- class
    - Must be a string and length must be between `2,3 or 4`
    - short code name of Train Class that you are intending to travel by
    - Can be anyone of the following `2A | 3A | SL | CC | 2S | FC | 1A | 3E`
- quota
    - Must be a string and length must be 2
    - code of the quota that you want to book the tickets
    - can be anyone of the following `GN | TQ | PT`
- train_number
    - Must be a String and length must be 5
    - Defines the Identity of the train as code number given by indian railways
- from
    - Must be a string and should match the with the list of existing station code names
    - Must be short code of the station from where you are boarding
    - The Train must pass by and have a stop at this station
- to
    - Must be a string and should match the with the list of existing station code names
    - Must be short code of the station to where you are travelling
    - The Train must pass by and have a stop at this station
- journey_date
    - Must be a String and in `YYYYMMDD` format
    - The date on which you are boarding the train
- mobile_number
    - Must be as string and length must be 10
    - Active Indian Mobile Number
- userID
    - Must be a string
    - Must be a valid user id given by IRCTC upon registering through their portal
- password
    - Must be a string
    - Must be linked to the userID
    - Throws a error if its wrong
    - Must not be expired
    - You have to login atleast once using the password in the IRCTC website before using it here
    - Must verify mobile number and email ID in the portal before using the credentials here
- coach
    - Must be a String
    - Preferred Coach for total ticket
    - Must be related to the class of the ticket
- passengers
    - Must be a List and Contains Javascript Object of Each Passenger details
    - Passengers list must contain maximum of 6 passengers for General
    - Passengers list must contain maximum of 4 passengers for tatkal and Premium Tatkal
    - Each passenger details must be enclosed in an javascript object format and include them in passengers list main field
    - Each Passenger Object Contains
        - name
            - Must be a string and Mandatory Field
            - The Name of the passenger, who takes the journey
            - Must match match with any one of their Nationally accepted ID Cards
            - The Name is sliced to 16 characters if you give more than 16 characters
        - age
            - Must be string and Mandatory
            - The age of the passenger
            - Must be between 5 and 125
        - sex
            - Must be a string and mandatory
            - Gender of the passenger
            - Acceptable genders `M or F`
        - food
            - Must be a string and Mandatory
            - The Food choice need to be empty string if the train does not serves the food
            - acceptable values `"V" | "N" | "D" | ""`
        - berth
            - Must be a string and Optional Parameter - Default to null
            - This is the preferred berth that the passenger is opting and instructing IRCTC to book on the preferred berth
            - However, IRCTC can not give guarantee on preferred berth opton
            - Values can be any one of the items `LB | UB | SL | SU | MB | WS`
        - country
            - Must be a string and Optional Parameter - Defaults to IN
            - ISO Country Code of the Passenger Nationality

The example input is as follows

```js
{
    "UPI": "9876543210@ybl",
    "class": "2S",
    "quota": "GN",
    "train_number": "17201",
    "from": "GNT",
    "to": "PDKN",
    "journey_date": "20240530",
    "mobile_number": "9876543210",
    "userID": "XXXXX",
    "password": "XXXXXXX",
    "passengers": [ 
        {
            "age": "22",
            "food": "",
            "name": "Virat Kohli",
            "sex": "M",
            "berth":"WS"
        },
        {
            "age": "21",
            "food": "",
            "name": "Anushka Sharma",
            "sex": "F",
            "country":"Uk"
        }
    ],
    "coach":"D1"
};
```

## book_output

The output is to be standardized and will be documented in future, currently Raw IRCTC data is sent as output

## last_transaction

The last transaction is the function which gives the status of last transaction initiated through the given userID

[Example Usage](https://github.com/suryavaddiraju/irctc-api/blob/main/examples/last_txn_status.js)

```js
import {IRCTC} from "irctc-api";
const irctc = new IRCTC();
const params = {
    // refer last_transaction_input
};
const response = await irctc.last_transaction(params);
console.log(response);
```

## last_transaction_input

`last_transaction` function in IRCTC class takes input as a javascript object, where they are explained below

`Mandatory Keys`

- userID
    - Must be a string
    - Must be a valid user id given by IRCTC upon registering through their portal
- password
    - Must be a string
    - Must be linked to the userID
    - Throws a error if its wrong
    - Must not be expired
    - You have to login atleast once using the password in the IRCTC website before using it here
    - Must verify mobile number and email ID in the portal before using the credentials here

## last_transaction_output

The output is to be standardized and will be documented in future, currently Raw IRCTC data is sent as output

## pnr_status

The PNR Status is the function which gives the status of PNR of a transaction initiated through the given userID

[Example Usage](https://github.com/suryavaddiraju/irctc-api/blob/main/examples/get_pnr_status.js)

```js
import {IRCTC} from "irctc-api";
const irctc = new IRCTC();
const params = {
    // refer pnr_status_input
};
const response = await irctc.pnr_status(params);
console.log(response);
```

## pnr_status_input

`pnr_status` function in IRCTC class takes input as a javascript object, where they are explained below

`Mandatory Keys`

- userID
    - Must be a string
    - Must be a valid user id given by IRCTC upon registering through their portal
- password
    - Must be a string
    - Must be linked to the userID
    - Throws a error if its wrong
    - Must not be expired
    - You have to login atleast once using the password in the IRCTC website before using it here
    - Must verify mobile number and email ID in the portal before using the credentials here
- pnr
    - Must be a string
    - Must have a length of 10
    - Must be linked to anytransaction of the USER

## pnr_status_output

The output is to be standardized and will be documented in future, currently Raw IRCTC data is sent as output

## Copyright

All Rights Reserved. &copy; Vaddiraju Surya Teja, 2024
