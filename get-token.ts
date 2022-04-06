const { readFileSync } = require("fs");
const crypto = require("crypto");
const ed = require("@noble/ed25519");
const bs58 = require("bs58");
import { IdentityClient } from '@iota/is-client';
import { defaultConfig } from './configuration';

(async () => {

    const client = new IdentityClient(defaultConfig)

    const identity = JSON.parse(readFileSync("./userIdentity.json").toString());
    
    await client.authenticate(identity.doc.id, identity.key.secret);

    console.log("JWT Token:", client.jwtToken);

})()
