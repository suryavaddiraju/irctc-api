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

[![Download stats](https://img.shields.io/npm/dw/irctc-api)](https://www.npmjs.com/package/irctc-api)
[![Supported Versions](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsuryavaddiraju%2Firctc-api%2Fmain%2Fpackage.json&query=engines.node&label=node)](https://www.npmjs.com/package/irctc-api)
[![Contributors](https://img.shields.io/github/contributors/suryavaddiraju/irctc-api.svg)](https://github.com/suryavaddiraju/irctc-api/graphs/contributors)
[![License](https://img.shields.io/github/license/suryavaddiraju/irctc-api)](http://www.apache.org/licenses/LICENSE-2.0)
[![Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsuryavaddiraju%2Firctc-api%2Fmain%2Fpackage.json&query=version&label=version)](https://www.npmjs.com/package/irctc-api)
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/suryavaddiraju/irctc-api)](https://github.com/suryavaddiraju/irctc-api/issues)
[![socket.dev](https://socket.dev/api/badge/npm/package/irctc-api/3.0.3)](https://socket.dev/npm/package/irctc-api)
[![GitHub last commit](https://img.shields.io/github/last-commit/suryavaddiraju/irctc-api)](https://github.com/suryavaddiraju/irctc-api)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/suryavaddiraju/irctc-api/node.js.yml)](https://github.com/suryavaddiraju/irctc-api/actions/workflows/node.js.yml)
[![GitHub Stars](https://img.shields.io/github/stars/suryavaddiraju/irctc-api)](https://github.com/suryavaddiraju/irctc-api/stargazers)
[![NPM Link](https://img.shields.io/badge/npm-irctc--api-black?logo=npm&labelColor=rgb(203%2C%2056%2C%2055))](https://www.npmjs.com/package/irctc-api)
[![Github Link](https://img.shields.io/badge/github-suryavaddiraju%2Firctc--api-blue?logo=github&labelColor=000000)](https://github.com/suryavaddiraju/irctc-api)
[![Documentation Link](https://img.shields.io/badge/documentation-irctc--api-blue)](https://dev.vaddiraju.in/irctc-api/api_reference)
[![Home Page Link](https://img.shields.io/badge/home-irctc--api-blue)](https://dev.vaddiraju.in/irctc-api)

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
- gcloud
    - This params can be `JSON String || Javascript Object || JSON File Buffer`
    - Google Cloud Service Account Credentials having permission of `serviceusage.services.use`
    - if this parameter is present we won't use viu for that process
    - `Note: This service is chargeable by Google and follow their terms and conditions`
    - To try this use below steps
        1. Create a Google Cloud account (Skip this step if you already have a Google Cloud account).
        2. Create a new, separate project.
        3. In the newly created project:
        - Search for `IAM & Admin` in the Google Cloud Console.
        - Go to `Roles` under IAM.
        4. Create a new role:
        - Set the title, description, and ID of your choice.
        - Set the Role Launch Stage to `General Availability`.
        5. Add the `serviceusage.services.use` permission to the role and click **Create**.
        6. Create a A New Service Account within IAM & Admin Page In `Service account details` - Give a Name, id, description of your choice and then in
        - `Service account details` - Give a Name, id, description of your choice
        - `Grant this service account access to project` - Attach the role that you created in previous step by searching your given name
        - `Grant users access to this service account (optional)` - Leave Empty
        - Then Click **Done**
        7. Go To service Accounts List of your project and Click on the email that you created in previous step download and Go to `Keys`and then `Create New Key - JSON`. You will get a json file in your browser downloads - `Keep this JSON`
        8. Search for `Cloud Vision API` in the Google Cloud Console and `Enable` it (Ignore, if its not already enabled)



The example input is as follows

```js
const irctc = new IRCTC(
{
    "userID":"XXXXXX",
    "password":"XXXXXXXXX",
    "viu":"./some/loaction/to/file.exe | ./some/loaction/to/file" // Optional
    "gcloud":{
        "type": "service_account",
        "project_id": "vision-api",
        "private_key_id": "b0357d061ce2c96737d96c2",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqdyztLFNG\n-----END PRIVATE KEY-----\n",
        "client_email": "default@vision-api.iam.gserviceaccount.com",
        "client_id": "12345678901234567",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/default%40vision-api.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
    }
});
```


## book_input

`book` function in IRCTC class takes input as a javascript object, where they are explained below

```
Note:

for book_input function, there are a set of mandatory keys and a set of optional keys. Optional Keys means they're not compulsory to be passed.
```

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
    - The date on which your train is at from station that you are trying to board
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
            - Must be a Integer and Mandatory
            - The age of the passenger
            - Must be between 0 and 125
        - gender
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
            - `Mandatory Passenger objects if foreigner`
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
    - board is the station where the passenger will be actually catching the train. this should not be confused with the mandatory from parameter which is a param for defining the starting point for the ticket. for eg. the passenger may book a train ticket from DEL to MUM, but he may prefer to join the journey at any intermediate station like AGC.
- gst
    - Must be a string and it must be the 17 digit GSTIN number
    - This param is not necessary unless you are a business owner and want to claim the gst later.



The example input is as follows

```js
// some_book.mjs
{
    "payment": "wallet", // for UPI Payment - "payment": "9876543210@pthdfc"
    "class": "2S",
    "quota": "GN",
    "train": "17201",
    "from": "GNT",
    "to": "PDKN",
    "date": "20241231",
    "mobile": "9876543210",
    "passengers": [
        {
            "age": 40,
            "name": "Virat Kohli",
            "gender": "M",
            "berth":"SL"
        },
        {
            "age": 40,
            "name": "Anushka Sharma",
            "gender": "F",
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

[Example Usage](https://github.com/suryavaddiraju/irctc-api/blob/main/examples/master_passengers.mjs)


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
