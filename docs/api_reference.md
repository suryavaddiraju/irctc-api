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

Currently Payment through UPI and IRCTC wallet is only supported

[Example Usage](https://github.com/suryavaddiraju/irctc-api/blob/main/examples/book.mjs)

```js
// some_fuction.mjs
import {IRCTC} from "irctc-api";
const irctc = new IRCTC({
    // refer irctc class
});
const book_input = {
    // refer book_input
}
const response = await irctc.book(book_input);
console.log(response);
```

## irctc class

`irctc` reusable class session for multiple function uses, it takes some argument that are written below

- `Mandatory Keys`

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

- `Optional Keys`

- viu
    - the path to viu folder, if it doesnot work it will fall back to auto download
    - if it not works it throws an error

The example input is as follows

```js
{
    "userID":"XXXXXX",
    "password":"XXXXXXXXX",
    "viu":"./some/loaction/to/file.exe | ./some/loaction/to/file"
};
```


## book_input

`book` function in IRCTC class takes input as a javascript object, where they are explained below

- `Mandatory Keys`
- payment
    - for UPI payment
        - Must be a string and have atleast three characters including `@`
        - Must be a active UPI ID issued under NPCI UPI Guidlines
        - It must be linked to atleast 1 bank account
        - It must be capable of handling UPI collect requests
    - for wallet payment
        - Must be string equals to "wallet"
 
- class
    - Must be a string and length must be between `2,3 or 4`
    - short code name of Train Class that you are intending to travel by
    - Can be anyone of the following `2A | 3A | SL | CC | 2S | FC | 1A | 3E`

- quota
    - Must be a string and length must be 2
    - code of the quota that you want to book the tickets
    - can be anyone of the following `GN | TQ | PT`

- train
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

- date
    - Must be a String and in `YYYYMMDD` format
    - The date on which you are boarding the train
- mobile
    - Must be as string and length must be 10
    - Active Indian Mobile Number
- passengers
    - Must be a List and Contains Javascript Object of Each Passenger details
    - Passengers list must contain maximum of 6 passengers for General
    - Passengers list must contain maximum of 4 passengers for tatkal and Premium Tatkal
    - Each passenger details must be enclosed in an javascript object format and include them in passengers list main field
    - Each Passenger Object Contains
        - `Mandatory Passenger Object Keys`
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
            - Acceptable genders `M or F or T`
        - `Optional Passenger Object Keys`
        - berth
            - Must be a string and Optional Parameter - Default to null
            - This is the preferred berth that the passenger is opting and instructing IRCTC to book on the preferred berth
            - However, IRCTC can not give guarantee on preferred berth opton
            - Values can be any one of the items `LB | UB | SL | SU | MB | WS`
        - country
            - Must be a string and Optional Parameter - Defaults to IN
            - ISO Country Code of the Passenger Nationality
            - if country is not IN then
            - `Mandatory Passenger`
            - passport
                - valid passport number
                - must be between 6 and 9 digits
            - DOB
                - Date of birth in YYYYMMDD format
- `Optional Keys`
- coach
    - Must be a String
    - Preferred Coach for total ticket
    - Must be related to the class of the ticket
- board
    - Must be a string and should match the with the list of existing station code names
    - Must be short code of the station from where you are boarding
    - The Train must pass by and have a stop at this station
-gst
    - Must be a string and it must be the 17 digit GSTIN number



The example input is as follows

```js
// some_book.mjs
{
    "payment": "wallet",
    "class": "2S",
    "quota": "GN",
    "train": "17201",
    "from": "GNT",
    "to": "PDKN",
    "date": "20243112",
    "mobile": "9876543210",
    "passengers": [
        {
            "age": 40,
            "name": "Virat Kohli",
            "sex": "M",
            "berth":"SL"
        },
        {
            "age": 40,
            "name": "Anushka Sharma",
            "sex": "F",
            "country":"US",
            "passport":"XYZ12345",
            "DOB":"19803112"
        }
    ],
    "gst":"33AAACB0482A1ZI",
    "coach":"D2"
};
```

## book_output

The output is to be standardized and will be documented in future, currently Raw IRCTC data is sent as output

## master_passengers

It is a function of irctc class which gives list of master passengers attached to the userID
- You can directly select your passenger from the list output and pass it in the passenger list of book function with additional to other passengers

```js
import {IRCTC} from "irctc-api";
const irctc = new IRCTC(irctc_class_params);
const response = await irctc.master_passengers();
console.log(response);
```

## last_transaction

The last transaction is the function which gives the status of last transaction initiated through the given userID

[Example Usage](https://github.com/suryavaddiraju/irctc-api/blob/main/examples/last_txn.mjs)

```js
import {IRCTC} from "irctc-api";
const irctc = new IRCTC(irctc_class_params);
const response = await irctc.last_transaction();
console.log(response);
```

## last_transaction_input

`last_transaction` function in IRCTC class does not need any parameters

## last_transaction_output

The output is to be standardized and will be documented in future, currently Raw IRCTC data is sent as output

## pnr_status

The PNR Status is the function which gives the status of PNR of a transaction initiated through the given userID

[Example Usage](https://github.com/suryavaddiraju/irctc-api/blob/main/examples/pnr_status.mjs)

```js
import {IRCTC} from "irctc-api";
const irctc = new IRCTC(irctc_class_params);
const params = {
    // refer pnr_status_input
};
const response = await irctc.pnr_status(params);
console.log(response);
```

## pnr_status_input

`pnr_status` function in IRCTC class takes input as a string, where they are explained below

`Mandatory Keys`
- pnr
    - Must be a string
    - Must have a length of 10
    - Must be linked to anytransaction of the USER

## pnr_status_output

The output is to be standardized and will be documented in future, currently Raw IRCTC data is sent as output


## countries
- It is an static list output of countries accepted by irctc, it can called through without class initiation


## stations
- It is an static list output of Railway station code names, it can called through without class initiation


## Copyright

All Rights Reserved. &copy; Vaddiraju Surya Teja, 2024
