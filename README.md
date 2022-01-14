# is-digit-channel-management

Channel management for Dig-IT

* `npm install`
* Copy Admin identity `adminIdentity.json` in this directory
* Copy `.env` file in this directory
* `npm run create-channel`: this will create `ownerIdentity.json` and `userIdentity.json`
* `npm run sign-nonce` will write out a JWT Token for the 

Than the device will issue an HTTP POST request like the following:

```bash
curl --location --request POST '<API_URL>/api/v0.1/channels/logs/<CHANNEL_ADDRESS>?api-key=<API_KEY>' \
--header 'Authorization: Bearer <JWT_TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "payload": "payload from device xyz"
}'
```

* The owner identity can read data from channel using `npm run read-data`

## Note

* API_URL and API_KEY are the one used in `.env`
* CHANNEL_ADDRESS is in the `address.json` file
* JWT_TOKEN is the one printed using `npm run get-token`

