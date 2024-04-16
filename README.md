# irctc-api
A package built on top of IRCTC Website APIs to make train tickets , managing user profile faster and simpler. Currently this package only works on NodeJs environment and we were not recommending this to use on browser or any other Javascript environment.

## Installing

To install the this package, simply type i or install irctc-api using the node package manager

- `npm install irctc-api`

## Prerequisite

This Package uses [viu](https://github.com/atanunq/viu), A rust module uses iterm image protocol for displaying images.

We use that for displaying captcha images on command line for login and bookings as to make your booking flow in a seamless way.

Hence you are required to download the viu executable file related to your OS and Processor Architecture from the [viu release Assets](https://github.com/atanunq/viu/releases/latest) then add the folder where the `viu` is stored in your environment variables.

Remeber to add the folder path and not the viu.exe file path in your environment variables.


### Notes

- Currently this project is designed to accept only UPI Collect request as payment option and other payment modes are not supported as of now. When the payment request is initiated, The command line will display the payment request details such that you need to complete the payment from your UPI mobile App.

- We request to verify whether viu is working or not by giving the below command

```console
$ viu example.jpeg -t
```

### Import

This Package exports a class named `IRCTC` which contains three functions.

- book
- last_transaction
- pnr_status

To send a request, you only need to import the `IRCTC`.

```js
// ES5 example
const { IRCTC } = require("irctc-api");
```

```ts
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
const client = new IRCTC();

const params = {
  /** input parameters */
};
const command = client.book(params);
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
We use the GitHub issues for tracking bugs and feature requests, but have limited bandwidth to address them.

- Visit [Developer Guide](https://example.com/developer_guide.html) or [API Reference](https://example.com/api_reference.html).

## Contributing

Any modifications will be overwritten the next time the `irctc-api` package is updated. To contribute to the package you can check our [generate clients scripts](https://example.com/generate-clients.html).

## License

This package is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE for more information.

## Client Commands (Operations List)

<details>
<summary>
book
</summary>

[Command API Reference](https://example.com/api_reference.html#book) / [Input](https://example.com/api_reference.html#book_input) / [Output](https://example.com/api_reference.html#book_output)

</details>
<details>
<summary>
last_transaction
</summary>

[Command API Reference](https://example.com/api_reference.html#last_transaction) / [Input](https://example.com/api_reference.html#last_transaction_input) / [Output](https://example.com/api_reference.html#last_transaction_output)

</details>
<details>
<summary>
pnr_status
</summary>

[Command API Reference](https://example.com/api_reference.html#pnr_status) / [Input](https://example.com/api_reference.html#pnr_status_input) / [Output](https://example.com/api_reference.html#pnr_status_output)

</details>
