A package built on top of IRCTC Website APIs to book train tickets, managing user profile faster and simpler. Currently this package only works on NodeJs environment and we were not recommending this to use on browser or any other Javascript environment.

## Useful Links

<a href="https://github.com/suryavaddiraju/irctc-api"><img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub Logo" width="50" height="50"/></a> <a href="https://www.npmjs.com/package/irctc-api"><img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" alt="npm Logo" width="50" height="50"/></a> <a href="https://dev.vaddiraju.in/irctc-api/api_reference"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Read-the-docs.png/330px-Read-the-docs.png" alt="Documentation Logo" width="50" height="50"/></a>

[![Download stats](https://img.shields.io/npm/dw/irctc-api)](https://www.npmjs.com/package/irctc-api)
[![Supported Versions](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsuryavaddiraju%2Firctc-api%2Fmain%2Fpackage.json&query=engines.node&label=node)](https://www.npmjs.com/package/irctc-api)
[![Contributors](https://img.shields.io/github/contributors/suryavaddiraju/irctc-api.svg)](https://github.com/suryavaddiraju/irctc-api/graphs/contributors)
[![License](https://img.shields.io/github/license/suryavaddiraju/irctc-api)](http://www.apache.org/licenses/LICENSE-2.0)
[![Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsuryavaddiraju%2Firctc-api%2Fmain%2Fpackage.json&query=version&label=version)](https://www.npmjs.com/package/irctc-api)
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/suryavaddiraju/irctc-api)](https://github.com/suryavaddiraju/irctc-api/issues)
[![socket.dev](https://socket.dev/api/badge/npm/package/irctc-api/3.0.6)](https://socket.dev/npm/package/irctc-api)
[![GitHub last commit](https://img.shields.io/github/last-commit/suryavaddiraju/irctc-api)](https://github.com/suryavaddiraju/irctc-api)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/suryavaddiraju/irctc-api/node.js.yml)](https://github.com/suryavaddiraju/irctc-api/actions/workflows/node.js.yml)
[![GitHub Stars](https://img.shields.io/github/stars/suryavaddiraju/irctc-api)](https://github.com/suryavaddiraju/irctc-api/stargazers)
[![NPM Link](https://img.shields.io/badge/npm-irctc--api-black?logo=npm&labelColor=rgb(203%2C%2056%2C%2055))](https://www.npmjs.com/package/irctc-api)
[![Github Link](https://img.shields.io/badge/github-suryavaddiraju%2Firctc--api-blue?logo=github&labelColor=000000)](https://github.com/suryavaddiraju/irctc-api)
[![Documentation Link](https://img.shields.io/badge/documentation-irctc--api-blue)](https://dev.vaddiraju.in/irctc-api/api_reference)
[![Home Page Link](https://img.shields.io/badge/home-irctc--api-blue)](https://dev.vaddiraju.in/irctc-api)


> [!NOTE] 
> ```
> This irctc-api script for automating IRCTC ticket booking
> is created strictly for educational purposes. The code and its
> usage are intended to showcase irctc-api testing capabilities and
> best practices. Any attempt to use this script for unauthorized
> access or activities that violate IRCTC terms of service or legal
> regulations is strictly prohibited. The author(s) and associated
> entities are not responsible for any misuse or legal consequences 
> resulting from the use of this script for any unauthorized 
> activities.
> ```


## Installing

To install the this package, simply type i or install irctc-api using the node package manager

```shell
npm install irctc-api
```

## Prerequisite

This Package uses [viu](https://github.com/atanunq/viu), A rust module uses iterm image protocol for displaying images within System Terminal.

We use that for displaying captcha images on command line for login and bookings as to make your booking flow in a seamless way.

`irctc-api` automatically installs `viu` binary based on your os and processor architecture, If we could not find your viu binary related to your processor and os, you are required to install `viu` through their standard installation.

Then provide `viu` binary path in params as

```json
{
  "viu":"path/to/binary/viu | path/to/binary/viu.exe"
}
```


### Notes

- Currently this project is designed to accept only UPI Collect request and IRCTC wallet as payment option and other payment modes are not supported as of now. When the payment request is initiated, The command line will display the payment request details such that you need to complete the payment from your UPI mobile App for UPI payment method.

### Import

This Package exports a class named `IRCTC` which contains three functions.

- book
- last_transaction
- pnr_status
- master_passengers

Other variables export
- countries
- stations


To send a request, you only need to import the `IRCTC`.

```js
// ES5 example
const { IRCTC } = require("irctc-api");
```

```js
// ES6+ example
import { IRCTC } from "irctc-api";
```
### Examples

The Code Examples are hosted at [Github Repo - suryavaddiraju/irctc-api](https://github.com/suryavaddiraju/irctc-api/tree/main/examples)

### Usage

To send a request, you:

- Initiate IRCTC class
- Call available function operation on class with input as javascript object.

```js
// a client can be shared by different commands. But it is currently in development untill then use client seperately.
const client = new IRCTC({
  // irctc_class_params
});

const params = {
  // refer https://dev.vaddiraju.in/irctc-api/api_reference#book_input
};
const command = await client.book(params);
```

#### Async/await

We recommend using [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
operator to wait for the promise returned by send operation as follows:

```js
// async/await.
try {
  const data = await client.book(params);
  // process data.
} catch (error) {
  // error handling.
} finally {
  // finally.
}
```

Async-await is clean, concise, intuitive, easy to debug and has better error handling
as compared to using Promise chains or callbacks.

## Getting Help

Please use these community resources for getting help.
We use the [GitHub issues](https://github.com/suryavaddiraju/irctc-api/issues) for tracking bugs and feature requests, but have limited bandwidth to address them.

- Visit [API Reference](https://dev.vaddiraju.in/irctc-api/api_reference).

## Contributing

Any modifications will be overwritten the next time the `irctc-api` package is updated. To contribute to the package you can check our [contribution](https://dev.vaddiraju.in/irctc-api/contribution) page.

## License

This package is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE for more information.

## Client Commands (Operations List)

<details>
<summary>
book
</summary>
<a href="https://dev.vaddiraju.in/irctc-api/api_reference#book">Command API Reference</a> / <a href="https://dev.vaddiraju.in/irctc-api/api_reference#book_input">Input</a> / <a href="https://dev.vaddiraju.in/irctc-api/api_reference#book_output">Output</a>
</details>
<details>
<summary>
last_transaction
</summary>
<a href="https://dev.vaddiraju.in/irctc-api/api_reference#last_transaction">Command API Reference</a> / <a href="https://dev.vaddiraju.in/irctc-api/api_reference#last_transaction_input">Input</a> / <a href="https://dev.vaddiraju.in/irctc-api/api_reference#last_transaction_output">Output</a>
</details>
<details>
<summary>
pnr_status
</summary>
<a href="https://dev.vaddiraju.in/irctc-api/api_reference#pnr_status">Command API Reference</a> / <a href="https://dev.vaddiraju.in/irctc-api/api_reference#pnr_status_input">Input</a> / <a href="https://dev.vaddiraju.in/irctc-api/api_reference#pnr_status_output">Output</a>
</details>

## Copyright

All Rights Reserved. &copy; Vaddiraju Surya Teja, 2024
