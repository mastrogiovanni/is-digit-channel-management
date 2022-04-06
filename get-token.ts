const { readFileSync } = require("fs");
const crypto = require("crypto");
const ed = require("@noble/ed25519");
const bs58 = require("bs58");
const { BaseClient } = require("@iota/is-client");
import { defaultConfig } from './configuration';

(async () => {

    const client = new BaseClient(defaultConfig)

    const identity = JSON.parse(readFileSync("./userIdentity.json").toString());

    const body = await client.get(`authentication/prove-ownership/${identity?.doc?.id}`);
    const nonce = body?.nonce;
    const encodedKey = await client.getHexEncodedKey(identity?.key?.secret);
    const signedNonce = await client.signNonce(encodedKey, nonce);
    const { jwt } = await client.post(`authentication/prove-ownership/${identity?.doc?.id}`, {
        signedNonce
    });

    console.log("JWT Token:", jwt);

})()
